// 베스트셀러 슬라이더
const books = [
  { title: "혼모노", author: "성해나", desc: "이 책은 혼모노임...", image: "../../assets/imgs/usedBookImg/bestbook1.jpeg" },
  { title: "어른의 행복은 조용하다", author: "태수", desc: "이 책은 어른의 행복은 조용하다임...", image: "../../assets/imgs/usedBookImg/bestbook2.jpeg" },
  { title: "소년이 온다", author: "한강", desc: "이 책은 소년이 온다임...", image: "../../assets/imgs/usedBookImg/bestbook3.jpeg" },
  { title: "모순", author: "양귀자", desc: "이 책은 모순임...", image: "../../assets/imgs/usedBookImg/bestbook4.jpeg" },
  { title: "박곰희 연금 부자 수업", author: "박곰희", desc: "이 책은 박곰희 연금 부자 수업임...", image: "../../assets/imgs/usedBookImg/bestbook5.jpeg" }
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

  // 클릭시 상세페이지 이동
  main.addEventListener("click", () => {
    location.href = "../detailPage/detailPage.html";
  }); 

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


// '다음','이전' 버튼 이벤트
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
    name: "중고 국내도서",
    books: [
      { title: "편안함의 습격", image: "../../assets/imgs/usedBookImg/book1.jpeg" },
      { title: "마흔에 읽는 쇼펜하우어", image: "../../assets/imgs/usedBookImg/book2.jpeg" },
      { title: "경험의 멸종", image: "../../assets/imgs/usedBookImg/book3.jpeg" },
      { title: "쇼펜하우어 인생수업 2", image: "../../assets/imgs/usedBookImg/book4.jpeg" },
      { title: "불변의 법칙", image: "../../assets/imgs/usedBookImg/book5.jpeg" }
    ]
  },
  {
    name: "중고 외국도서",
    books: [
      { title: "Holes", image: "../../assets/imgs/usedBookImg/book6.jpeg" },
      { title: "A Long Walk to Water", image: "../../assets/imgs/usedBookImg/book7.jpeg" },
      { title: "Diary of a Wimpy Kid", image: "../../assets/imgs/usedBookImg/book8.jpeg" },
      { title: "How to Steal a Dog", image: "../../assets/imgs/usedBookImg/book9.jpeg" },
      { title: "The Little Prince", image: "../../assets/imgs/usedBookImg/book10.jpeg" }
    ]
  },
  {
    name: "중고 음반",
    books: [
      { title: "아이유 (IU) - EP : 꽃갈피 셋", image: "../../assets/imgs/usedBookImg/book11.jpeg" },
      { title: "한로로 (HANRORO) - 3rd EP '자몽살구클럽'", image: "../../assets/imgs/usedBookImg/book12.jpeg" },
      { title: "DAY6 (데이식스) - The DECADE", image: "../../assets/imgs/usedBookImg/book13.jpeg" },
      { title: "잔나비 - 4집 : 사운드 오브 뮤직 pt.1", image: "../../assets/imgs/usedBookImg/book14.jpeg" },
      { title: "백예린 - Flash and Core", image: "../../assets/imgs/usedBookImg/book15.png" }
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
  title.textContent = category.name;    // 데이터 들어감

  header.appendChild(title);

  // 책 목록 컨테이너 만듦
  const list = document.createElement("div");
  list.className = "book-list";

  category.books.forEach(book => {    // 책 하나하나 카드로 만듦
    // 책 카드 생성
    const card = document.createElement("div");
    card.className = "book-card";

    // 클릭시 상세페이지 이동
    card.addEventListener("click", () => {
      location.href = "../detailPage/detailPage.html";
    }) 

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


  // 더보기 버튼
  const moreBtn = document.createElement("button");
  moreBtn.className = "more-btn";
  moreBtn.textContent = "더보기";

  moreBtn.addEventListener("click", () => {
    alert("준비 중인 페이지입니다");
  });

  section.append(header, list, moreBtn);
  container.appendChild(section);
});


// 왼쪽 사이드바
const sidebarCategories = [
  "중고 국내도서", "중고 외국도서", "중고 음반", "위아북스 중고도서", "중고 DVD", "중고팔기", "중고매장"
];

const categoryList = document.getElementById("categoryList");

sidebarCategories.forEach(name => {    // forEach로 카테고리 이름 하나씩 처리
  const li = document.createElement("li");
  li.textContent = name;
  li.className = "category-item";

  li.addEventListener("click", () => {
    const target = document.querySelector(`[data-category="${name}"]`);

    if (target) {   // 해당 카테고리 섹션이 있는 경우
      target.scrollIntoView({ behavior: "smooth" });
    } else {       // 해당 카테고리 섹션이 없는 경우
      alert("준비 중인 카테고리입니다");
    }
  });

  categoryList.appendChild(li);
});


// 맨 위로 이동하는 버튼
const toTopBtn = document.getElementById("toTopBtn");

// 스크롤하면 버튼 보이기
window.addEventListener("scroll", () => {   // 페이지를 스크롤할 때마다 실행
  if (window.scrollY > 300) {               // 300px 내려왔다면
    toTopBtn.style.display = "block";       // 버튼 보이기
  } else {
    toTopBtn.style.display = "none";
  }
});

// 클릭하면 맨 위로
toTopBtn.addEventListener("click", () => {
  window.scrollTo({   // 브라우저에게 명령
    top: 0,
    behavior: "smooth"
  });
});