export function Interior() {
  return (
    <section className="interior" id="interior">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">STORE INTERIOR</div>
          <h2>
            밝고 깔끔한 공간,
            <br />
            브랜드를 담은 인테리어
          </h2>
          <p>
            얇게 말린 대패의 형태를 모티브로 한 물결 디자인과 밝고 정돈된 공간 구성으로
            고품격대패만의 차별화된 매장 분위기를 완성했습니다.
          </p>
        </div>
        <div className="interior-gallery">
          <div className="interior-gallery__feature">
            <img
              src="/assets/imgs/interior_salad_bar.jpg"
              alt="고품격대패 매장 내 '자연을 담은 Salad Bar' 월사인과 물결 조명 인테리어"
            />
          </div>
          <div className="interior-gallery__sub">
            <div className="interior-gallery__item">
              <img
                src="/assets/imgs/interior_menu_wall.jpg"
                alt="메뉴 가격이 새겨진 월사인 인테리어"
              />
            </div>
            <div className="interior-gallery__item">
              <img src="/assets/imgs/interior_hall_1.jpg" alt="고품격대패 홀 테이블 좌석 전경" />
            </div>
            <div className="interior-gallery__item">
              <img src="/assets/imgs/interior_hall_2.jpg" alt="고품격대패 넓은 다이닝홀 전경" />
            </div>
            <div className="interior-gallery__item">
              <img
                src="/assets/imgs/interior_hall_3.jpg"
                alt="고품격대패 매장 입구 방향 다이닝홀 전경"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
