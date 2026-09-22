export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-foreground">
      <h1 className="text-3xl font-bold">고품격대패 — Next.js 환경 세팅 완료</h1>
      <p className="text-muted-foreground">
        이 페이지는 기술스택 전환 1단계(환경 세팅)용 임시 화면입니다. 기존 정적 랜딩(
        <code className="rounded bg-muted px-1.5 py-0.5">index.html</code>)은 콘텐츠 마이그레이션
        단계에서 이 위치로 옮겨질 예정입니다.
      </p>
    </main>
  );
}
