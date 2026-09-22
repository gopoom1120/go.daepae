#!/usr/bin/env bash
# PostToolUse(Write|Edit) 훅
# data/palettes.json 또는 js/app.js 를 수정한 직후 데이터 무결성을 검사한다.
#
# 검사 항목
#   1. palettes.json 이 유효한 JSON 인가
#   2. 각 항목에 필수 필드가 있는가
#   3. image 경로의 파일이 실제로 존재하는가
#   4. app.js 의 FALLBACK 항목 id 가 palettes.json 과 일치하는가
#
# 문제가 있으면 decision:block 으로 Claude 에게 피드백한다.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

file="$(cat | jq -r '.tool_input.file_path // .tool_response.filePath // empty')"

# 관심 있는 파일이 아니면 조용히 통과
case "$file" in
  */data/palettes.json | */js/app.js) ;;
  *) exit 0 ;;
esac

python3 - "$ROOT" <<'PY'
import json, os, re, sys

root = sys.argv[1]
data_path = os.path.join(root, "data", "palettes.json")
app_path = os.path.join(root, "js", "app.js")
problems = []

try:
    with open(data_path, encoding="utf-8") as f:
        data = json.load(f)
except FileNotFoundError:
    sys.exit(0)
except json.JSONDecodeError as e:
    problems.append(f"data/palettes.json 파싱 실패 (line {e.lineno}): {e.msg}")
    data = None

if data is not None:
    items = data.get("items", [])
    if not items:
        problems.append("data/palettes.json 의 items 가 비어 있습니다.")

    ids = []
    for i, item in enumerate(items):
        label = item.get("id") or f"items[{i}]"
        ids.append(item.get("id"))

        for key in ("id", "title", "description"):
            if not item.get(key):
                problems.append(f"{label}: 필수 필드 '{key}' 가 없습니다.")

        image = item.get("image")
        if image:
            resolved = os.path.normpath(os.path.join(root, image.lstrip("./")))
            if not os.path.isfile(resolved):
                problems.append(f"{label}: image 파일이 없습니다 -> {image}")
        elif not item.get("art"):
            problems.append(f"{label}: image 도 art 도 없어 제품컷을 그릴 수 없습니다.")

    # app.js 의 FALLBACK 과 id 동기화 확인
    try:
        with open(app_path, encoding="utf-8") as f:
            app_src = f.read()
    except FileNotFoundError:
        app_src = ""

    if app_src:
        fallback = app_src.split("var FALLBACK", 1)[-1].split("var grid", 1)[0]
        fb_ids = re.findall(r'id:\s*"([^"]+)"', fallback)
        missing = [i for i in ids if i and i not in fb_ids]
        extra = [i for i in fb_ids if i not in ids]
        if missing or extra:
            problems.append(
                "js/app.js 의 FALLBACK 이 palettes.json 과 어긋납니다. "
                f"누락={missing or '없음'}, 불필요={extra or '없음'} "
                "(file:// 로 열 때 쓰이는 데이터이므로 함께 갱신하세요)"
            )

if problems:
    reason = "데이터 정합성 문제:\n- " + "\n- ".join(problems)
    print(json.dumps({"decision": "block", "reason": reason}, ensure_ascii=False))
PY
