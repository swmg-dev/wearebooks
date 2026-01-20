// DOM
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const list = document.getElementById("list");

// 유틸: 결과 영역 닫기
function closeResults() {
  list.innerHTML = "";
  list.classList.remove("is-open");
}

// 유틸: 결과 영역 열기
function openResults() {
  list.classList.add("is-open");
}

// ✅ 검색: "입력 전체" 기준 포함 검색
function searchBooks(input) {
  const q = (input ?? "").trim().toLowerCase();
  if (q.length < 2) return [];

  return books.filter((book) => (book.title ?? "").toLowerCase().includes(q));
}

// ✅ productType -> 라벨 변환
function getProductLabel(productType) {
  switch (productType) {
    case "domestic":
      return "국내도서";
    case "overseas":
      return "해외도서";
    case "used":
      return "중고책";
    case "ebook":
      return "eBook";
  }
}

// ✅ 그룹핑 (productType 기준)
function groupByProductType(items) {
  const grouped = {
    domestic: [],
    overseas: [],
    used: [],
    ebook: [],
  };

  items.forEach((book) => {
    grouped[book.productType].push(book);
  });

  return grouped;
}

// ✅ 렌더링: 그룹 헤더 + 아이템들
function renderGroupedResults(grouped) {
  list.innerHTML = "";

  const order = ["domestic", "overseas", "used", "ebook"];

  order.forEach((key) => {
    const items = grouped[key];
    if (!items || items.length === 0) return;

    const sectionLi = document.createElement("li");
    sectionLi.className = "search-group";

    const label = key === "etc" ? "기타" : getProductLabel(key);

    sectionLi.innerHTML = `
      <div class="search-group__title">[${label}]</div>
      <ul class="search-group__list"></ul>
    `;

    const ul = sectionLi.querySelector(".search-group__list");

    items.forEach((book) => {
      const itemLi = document.createElement("li");
      itemLi.className = "search-item";

      itemLi.innerHTML = `
        <span class="title">${book.title ?? ""}</span>
        <span class="author">${book.author ?? ""}</span>
      `;

      ul.appendChild(itemLi);
    });

    list.appendChild(sectionLi);
  });
}

// 버튼 클릭: 이때만 결과를 보여준다
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const val = searchInput.value.trim();

  // ✅ 2글자 미만이면 아예 닫기 (너의 의도)
  if (val.length < 2) {
    closeResults();
    return;
  }

  const results = searchBooks(val);

  // 검색 버튼 눌렀을 때만 영역 오픈
  openResults();

  if (results.length === 0) {
    list.innerHTML = `<li><p>검색 결과가 없습니다.</p></li>`;
    return;
  }

  const grouped = groupByProductType(results);
  renderGroupedResults(grouped);
});

// 입력값이 "비면" 결과도 같이 사라지게
searchInput.addEventListener("input", () => {
  const val = searchInput.value.trim();
  if (!val) closeResults();
});
