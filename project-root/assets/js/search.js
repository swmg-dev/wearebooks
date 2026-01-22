const books = window.books ?? []; // ✅ 추가 (books.js가 window.books면)

const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const list = document.getElementById("list");

function closeResults() {
  list.innerHTML = "";
  list.classList.remove("is-open");
}
function openResults() {
  list.classList.add("is-open");
}

function searchBooks(input) {
  const q = (input ?? "").trim().toLowerCase();
  if (q.length < 2) return [];
  return books.filter((book) => (book.title ?? "").toLowerCase().includes(q));
}

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
    default:
      return "기타";
  }
}

function groupByProductType(items) {
  const grouped = { domestic: [], overseas: [], used: [], ebook: [] };

  items.forEach((book) => {
    const key = book.productType;
    if (!grouped[key]) return;
    grouped[key].push(book);
  });

  return grouped;
}

function renderGroupedResults(grouped) {
  list.innerHTML = "";

  const order = ["domestic", "overseas", "used", "ebook"];

  order.forEach((key) => {
    const items = grouped[key];
    if (!items || items.length === 0) return;

    const sectionLi = document.createElement("li");
    sectionLi.className = "search-group";

    const titleDiv = document.createElement("div");
    titleDiv.className = "search-group__title";
    titleDiv.textContent = `[${getProductLabel(key)}]`;

    const ul = document.createElement("ul");
    ul.className = "search-group__list";

    items.forEach((book) => {
      const itemLi = document.createElement("li");
      itemLi.className = "search-item";

      // ✅ 핵심: 상세페이지 링크 만들기
      // index.html 기준 상대경로: pages/detailPage/detailPage.html
      const a = document.createElement("a");
      const id = book.id ?? "";
      a.href = `pages/detailPage/detailPage.html?id=${encodeURIComponent(id)}`;

      const titleSpan = document.createElement("span");
      titleSpan.className = "title";
      titleSpan.textContent = book.title ?? "";

      const authorSpan = document.createElement("span");
      authorSpan.className = "author";
      authorSpan.textContent = book.author ?? "";

      a.appendChild(titleSpan);
      a.appendChild(document.createTextNode(" - "));
      a.appendChild(authorSpan);

      itemLi.appendChild(a);
      ul.appendChild(itemLi);
    });

    sectionLi.appendChild(titleDiv);
    sectionLi.appendChild(ul);
    list.appendChild(sectionLi);
  });

  // (선택) 결과 클릭하면 목록 닫기
  // list 안에서 a 클릭 시 닫히도록 이벤트 위임
  list.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      closeResults();
    },
    { once: true },
  );
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const val = searchInput.value.trim();
  if (val.length < 2) {
    closeResults();
    return;
  }

  const results = searchBooks(val);
  openResults();

  if (results.length === 0) {
    list.innerHTML = `<li><p>검색 결과가 없습니다.</p></li>`;
    return;
  }

  const grouped = groupByProductType(results);
  renderGroupedResults(grouped);
});

searchInput.addEventListener("input", () => {
  const val = searchInput.value.trim();
  if (!val) closeResults();
});

function resetSearchUI() {
  // input 비우기
  if (searchInput) searchInput.value = "";

  // 결과 닫기 + 비우기
  closeResults();
}

// 뒤로가기/앞으로가기(bfcache) 포함: 화면에 다시 나타날 때마다 초기화
window.addEventListener("pageshow", (e) => {
  // e.persisted === true면 bfcache로 복원된 케이스(뒤로가기)
  resetSearchUI();
});
