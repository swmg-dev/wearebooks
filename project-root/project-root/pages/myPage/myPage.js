const STORAGE_KEY = "yes24_orders";

const seedOrders = [
    { orderId: "1", date: "2026-01-14", book: "데미안 (헤르만 헤세)", qty: 1, status: "주문완료" },
    { orderId: "2", date: "2026-01-10", book: "어린 왕자", qty: 1, status: "주문완료" },
    { orderId: "3", date: "2025-12-28", book: "미움받을 용기", qty: 1, status: "주문완료" },
    { orderId: "4", date: "2025-12-05", book: "철학의 위안", qty: 1, status: "주문완료" },
];

const tbody = document.getElementById("ordersTbody");

function loadOrders() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedOrders));
        return [...seedOrders];
    }
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [...seedOrders];
    } catch {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedOrders));
        return [...seedOrders];
    }
}

function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getTodayYYYYMMDD() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function getNextOrderId(orders) {
    const nums = orders.map(o => parseInt(o.orderId, 10)).filter(n => Number.isFinite(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return String(max + 1);
}

function normalizeQty(qty) {
    const n = parseInt(qty, 10);
    if (!Number.isFinite(n) || n <= 0) return 1;
    return n;
}

function renderOrders(orders) {
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>${escapeHtml(o.orderId)}</td>
        <td>${escapeHtml(o.date)}</td>
        <td>${escapeHtml(o.book)}</td>
        <td>${escapeHtml(o.qty)}</td>
        <td><span class="status">${escapeHtml(o.status || "주문완료")}</span></td>
        <td>
          <button class="btn track-btn"
            data-order="${escapeHtml(o.orderId)}"
            data-date="${escapeHtml(o.date)}"
            data-book="${escapeHtml(o.book)}"
            data-qty="${escapeHtml(o.qty)}"
            data-status="${escapeHtml(o.status || "주문완료")}">
            조회
          </button>
        </td>
      </tr>
    `).join("");

    document.querySelectorAll('.track-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal({
                order: btn.dataset.order,
                date: btn.dataset.date,
                book: btn.dataset.book,
                qty: btn.dataset.qty,
                status: btn.dataset.status
            });
        });
    });
}

function consumeIncomingOrder(orders) {
    const params = new URLSearchParams(location.search);
    const book = params.get("book");
    const qty = normalizeQty(params.get("qty"));

    if (!book) return orders;

    const date = getTodayYYYYMMDD();
    const status = "주문완료";

    let newId = getNextOrderId(orders);
    while (orders.some(o => String(o.orderId) === String(newId))) {
        newId = getNextOrderId(orders);
    }

    orders.unshift({ orderId: newId, date, book, qty, status });
    saveOrders(orders);

    history.replaceState({}, "", "myPage.html");
    return orders;
}

// ===== Modal =====
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');

const mOrder = document.getElementById('mOrder');
const mDate = document.getElementById('mDate');
const mBook = document.getElementById('mBook');
const mQty = document.getElementById('mQty');
const mStatus = document.getElementById('mStatus');

function openModal(data) {
    mOrder.textContent = data.order;
    mDate.textContent = data.date;
    mBook.textContent = data.book;
    mQty.textContent = data.qty;
    mStatus.textContent = data.status;
    modal.dataset.open = "true";
}
function closeModal() { modal.dataset.open = "false"; }

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.dataset.open === "true") closeModal();
});

// ===== 실행 =====
let orders = loadOrders();
orders = consumeIncomingOrder(orders);
renderOrders(orders);