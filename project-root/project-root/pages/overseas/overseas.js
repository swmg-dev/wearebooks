// 베스트셀러 슬라이더
const books = [
  { title: "The Cafe on the Edge of the World", author: "존 스트레레키", desc: "이 책은 The Cafe on the Edge of the World임...", image: "../../assets/imgs/overseasImg/bestbook1.jpeg" },
  { title: "Wonder (미국판) : 줄리아 로버츠 주연 영화 '원더' 원작 소설", author: "R. J. 팔라시오", desc: "이 책은 Wonder (미국판) : 줄리아 로버츠 주연 영화 '원더' 원작 소설임...", image: "../../assets/imgs/overseasImg/bestbook2.jpeg" },
  { title: "スペシャルエディション(坂田銀時＆神威)", author: "소라치 히데아키", desc: "이 책은 スペシャルエディション(坂田銀時＆神威)임...", image: "../../assets/imgs/overseasImg/bestbook3.jpeg" },
  { title: "The Giver 기억 전달자", author: "로이스 라우리", desc: "이 책은 The Giver 기억 전달자임...", image: "../../assets/imgs/overseasImg/bestbook4.jpeg" },
  { title: "Because of Winn-Dixie", author: "DiCamillo, Kate", desc: "이 책은 Because of Winn-Dixie임...", image: "../../assets/imgs/overseasImg/bestbook5.jpeg" }
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
    name: "문학 소설",
    books: [
      { title: "Hamnet", image: "../../assets/imgs/overseasImg/book1.jpeg" },
      { title: "Cormoran Strike #08 : The Hallmarked Man", image: "../../assets/imgs/overseasImg/book2.jpeg" },
      { title: "The Secret of Secrets", image: "../../assets/imgs/overseasImg/book3.jpeg" },
      { title: "Not Quite Dead Yet", image: "../../assets/imgs/overseasImg/book4.jpeg" },
      { title: "Katabasis", image: "../../assets/imgs/overseasImg/book5.jpeg" }
    ]
  },
  {
    name: "경제 경영",
    books: [
      { title: "Apple in China", image: "../../assets/imgs/overseasImg/book6.jpeg" },
      { title: "How Countries Go Broke: The Big Cycle", image: "../../assets/imgs/overseasImg/book7.jpeg" },
      { title: "The Nvidia Way : Jensen Huang and the Making of a Tech Giant", image: "../../assets/imgs/overseasImg/book8.jpeg" },
      { title: "The Art of Laziness", image: "../../assets/imgs/overseasImg/book9.jpeg" },
      { title: "What's Your Dream?", image: "../../assets/imgs/overseasImg/book10.jpeg" }
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
