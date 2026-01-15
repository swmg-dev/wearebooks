// 베스트셀러 슬라이더
const books = [
  { title: "최강록의 요리 노트", author: "최강록", desc: "이 책은 최강록의 요리 노트임...", image: "../../assets/imgs/eBookImg/bestbook1.jpeg" },
  { title: "따뜻한 여사의 월간 집밥", author: "김수림", desc: "이 책은 따뜻한 여사의 월간 집밥임...", image: "../../assets/imgs/eBookImg/bestbook2.jpeg" },
  { title: "진짜 맛있어서 평생 먹고 싶은 유지만 다이어트 레시피", author: "유지만", desc: "이 책은 진짜 맛있어서 평생 먹고 싶은 유지만 다이어트 레시피임...", image: "../../assets/imgs/eBookImg/bestbook3.jpeg" },
  { title: "똑게육아", author: "로리(김준희)", desc: "이 책은 똑게육아임...", image: "../../assets/imgs/eBookImg/bestbook4.jpeg" },
  { title: "그릿", author: "김주환", desc: "이 책은 그릿임...", image: "../../assets/imgs/eBookImg/bestbook5.jpeg" }
];

let currentIndex = 0;     // 현재 대표로 보여줄 베스트 도서의 인덱스

const bestsellerBox = document.querySelector(".bestseller-box");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// 베스트셀러 렌더링
function renderBestseller() {

  // 기존 내용 제거
  const oldLayout = bestsellerBox.querySelector(".bestseller-layout");
  if (oldLayout) oldLayout.remove();

  // 레이아웃 컨테이너 생성
  const layout = document.createElement("div");
  layout.className = "bestseller-layout";

  // 왼쪽 베스트셀러 도서
  const main = document.createElement("div");
  main.className = "bestseller-main";

  const mainBook = books[currentIndex];     // 현재 인덱스의 책이 대표 도서
  main.innerHTML = `
    <img src="${mainBook.image}" alt="${mainBook.title}">
    <div class="book-info">
      <h3>${mainBook.title}</h3>
      <p>${mainBook.author}</p>
      <p>${mainBook.desc}</p>
    </div>
  `;     // currentIndex가 바뀌면 자동으로 다른 책이 메인에 표시됨 

  // 오른쪽 미리보기 도서
  const previewWrapper = document.createElement("div");
  previewWrapper.className = "bestseller-preview-wrapper";

  const preview = document.createElement("div");
  preview.className = "bestseller-preview";

  for (let i = 1; i <= 3; i++) {    // 대표 도서 다음 순서부터 3권
    const idx = (currentIndex + i) % books.length;
    const book = books[idx];

    // 미리보기 카드 생성
    const card = document.createElement("div");
    card.className = "preview-card";
    card.innerHTML = `<img src="${book.image}" alt="${book.title}">`;

    // 미리보기 클릭 시 해당 책을 메인으로
    card.addEventListener("click", () => {
      currentIndex = idx;   // 해당 책 인덱스로 currentIndex 변경
      renderBestseller();   // 화면 다시 렌더링
    });

    preview.appendChild(card);
  }

  previewWrapper.appendChild(preview);

  layout.append(main, previewWrapper);
  bestsellerBox.insertBefore(layout, prevBtn);
}

// 버튼 이벤트
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % books.length;
  renderBestseller();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + books.length) % books.length;    // + books.length : 음수 방지용
  renderBestseller();
});

renderBestseller();   // 페이지 로딩 시 첫 베스트 도서 바로 표시

// 책 목록 부분
const categories = [
  {
    name: "건강 취미 여행",
    books: [
      { title: "최박사의 운동 혁명", image: "../../assets/imgs/eBookImg/book1.jpeg" },
      { title: "박용우의 마이 옵티멀 다이어트", image: "../../assets/imgs/eBookImg/book2.jpeg" },
      { title: "김대리의 데일리 뜨개", image: "../../assets/imgs/eBookImg/book3.jpeg" },
      { title: "밀리터리 리뷰 이지 2601", image: "../../assets/imgs/eBookImg/book4.jpeg" },
      { title: "리얼 오사카", image: "../../assets/imgs/eBookImg/book5.jpeg" }
    ]
  },
  {
    name: "국어 외국어",
    books: [
      { title: "EBS 라디오 입이 트이는 영어", image: "../../assets/imgs/eBookImg/book6.jpeg" },
      { title: "김재우의 영어회화 100", image: "../../assets/imgs/eBookImg/book7.jpeg" },
      { title: "가브리엘의 잉글리시 다이어리", image: "../../assets/imgs/eBookImg/book8.jpeg" },
      { title: "해커스 일본어 첫걸음", image: "../../assets/imgs/eBookImg/book9.jpeg" },
      { title: "영어 프리토킹 100일의 기적 with AI", image: "../../assets/imgs/eBookImg/book10.jpeg" }
    ]
  }
];

const container = document.getElementById("bookSections");

// 카테고리별로 섹션 만듦
categories.forEach(category => {    // categories 배열을 하나씩 순회. category 하나 = 하나의 섹션
  const section = document.createElement("section");
  section.className = "book-section content-box";
  section.setAttribute("data-category", category.name);

  // 섹션 헤더 만듦 (제목)
  const header = document.createElement("div");
  header.className = "section-header";

  const title = document.createElement("h3");
  title.className = "section-title";
  title.textContent = category.name;

  header.appendChild(title);

  // 책 목록 컨테이너 만듦
  const list = document.createElement("div");
  list.className = "book-list";

  category.books.forEach(book => {    // 책 하나하나 카드로 만듦
    // 책 카드 생성
    const card = document.createElement("div");
    card.className = "book-card";

    // 책 이미지
    const img = document.createElement("img");
    img.src = book.image;

    // 책 제목
    const name = document.createElement("p");
    name.className = "book-name";
    name.textContent = book.title;

    card.append(img, name);
    list.appendChild(card);
  });

  // 더보기 버튼 만듦
  const moreBtn = document.createElement("button");
  moreBtn.className = "more-btn";
  moreBtn.textContent = "더보기";

  section.append(header, list, moreBtn);
  container.appendChild(section);
});

// 왼쪽 사이드바
const categoryList = document.getElementById("categoryList");

categories.forEach(category => {                              // categories 배열을 하나씩 순회
  const li = document.createElement("li");                    // 왼쪽 사이드바에 들어갈 <li> 생성
  li.textContent = category.name;                             // 텍스트 = 카테고리 이름
  li.className = "category-item";                             // 스타일용 클래스 적용

  li.addEventListener("click", () => {                        // 사이드바 항목 클릭 이벤트
    document
      .querySelector(`[data-category="${category.name}"]`)
      .scrollIntoView({ behavior: "smooth" });                // scrollIntoView: 해당 섹션이 화면에 보이도록 스크롤 이동
  });

  categoryList.appendChild(li);                               // 만든 <li>를 사이드바 목록에 추가
});
