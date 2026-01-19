// myPage.js (cart.js 수정 없이 연동: localStorage "orders" -> weAre_orders:<userId>로 import)

const LOGIN_ID_KEY = "loginUserId";

// cart.js가 저장하는 주문 키
const CART_ORDERS_KEY = "orders";

// (선택) pending 키도 남겨두기 (팀에서 나중에 쓰면 자동 지원)
const PENDING_BASE = "weAre_pending_order";

// ===== Toast =====
const toastEl = document.getElementById("toast");
function toast(msg, ms = 1400) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("is-show");
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove("is-show"), ms);
}

function isLoggedIn() {
  return Boolean(localStorage.getItem("accessToken")) && Boolean(localStorage.getItem(LOGIN_ID_KEY));
}

function getUserId() {
  return localStorage.getItem(LOGIN_ID_KEY) || "";
}

// ===== 유저별 storage key =====
function getOrdersKey() {
  const userId = getUserId();
  return userId ? `weAre_orders:${userId}` : "weAre_orders";
}

// cart가 유저 구분 없이 orders에 저장하니까,
// myPage가 "어떤 orderId를 이미 가져왔는지"를 유저별로 기억해야 중복 import를 막을 수 있음
function getImportedKey() {
  const userId = getUserId();
  return userId ? `weAre_imported_orderIds:${userId}` : "weAre_imported_orderIds";
}

// pending도 유저별(혹시 쓰게 되면)
function getPendingKey() {
  const userId = getUserId();
  return userId ? `${PENDING_BASE}:${userId}` : PENDING_BASE;
}



const tbody = document.getElementById("ordersTbody");

// ===== 저장/로드 =====
function loadOrders() {
  const STORAGE_KEY = getOrdersKey();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  const STORAGE_KEY = getOrdersKey();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// ===== 유틸 =====
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPrice(price) {
  const n = Number(price);
  if (!Number.isFinite(n)) return escapeHtml(price);
  return n.toLocaleString("ko-KR") + "원";
}

function normalizeQty(qty) {
  const n = parseInt(qty, 10);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return n;
}

function isoToYYYYMMDD(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ===== cart.js의 "orders"를 myPage 주문 포맷으로 IMPORT =====
function getCartOrders() {
  try {
    const raw = localStorage.getItem(CART_ORDERS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function getImportedOrderIds() {
  try {
    const raw = localStorage.getItem(getImportedKey());
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setImportedOrderIds(ids) {
  localStorage.setItem(getImportedKey(), JSON.stringify(ids));
}

/**
 * cart.js가 만든 orders(주문 묶음) → myPage row(아이템 단위)로 변환해서 저장
 * - 중복 방지: orderId 기준으로 이미 import한 건 스킵
 */
function importFromCartOrders(ordersInMyPage) {
  const cartOrders = getCartOrders();
  if (!cartOrders.length) return ordersInMyPage;

  const imported = new Set(getImportedOrderIds());

  // 아직 import 안 된 주문만
  const newBundles = cartOrders.filter((o) => o?.orderId && !imported.has(o.orderId));
  if (!newBundles.length) return ordersInMyPage;

  const normalizedRows = [];

  for (const bundle of newBundles) {
    const date = isoToYYYYMMDD(bundle.orderedAt);
    const items = Array.isArray(bundle.items) ? bundle.items : [];

    for (const it of items) {
      // myPage row 포맷으로 변환
      normalizedRows.push({
        id: String(it?.id ?? ""),
        title: String(it?.title ?? ""),
        price: Number(it?.price ?? 0),
        img: String(it?.img ?? ""),
        author: String(it?.author ?? ""),
        qty: normalizeQty(it?.qty),
        status: "주문완료",
        date, // 모달에서 사용
        _fromOrderId: bundle.orderId, // 추적용(표시 안 함)
      });
    }

    imported.add(bundle.orderId);
  }

  // id/title 없는 것 제거
  const cleaned = normalizedRows.filter((x) => x.id && x.title);

  if (!cleaned.length) {
    setImportedOrderIds(Array.from(imported));
    return ordersInMyPage;
  }

  // 최신 주문이 위로
  const next = [...cleaned, ...ordersInMyPage];

  saveOrders(next);
  setImportedOrderIds(Array.from(imported));

  return next;
}

/**
 * (선택) pending 주문도 흡수 (팀에서 쓰면 자동으로 들어옴)
 * - 객체 1개 또는 배열 모두 지원
 */
function consumePendingOrder(orders) {
  const PENDING_KEY = getPendingKey();
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return orders;

  let incoming;
  try {
    incoming = JSON.parse(raw);
  } catch {
    localStorage.removeItem(PENDING_KEY);
    return orders;
  }

  const items = Array.isArray(incoming) ? incoming : [incoming];

  const normalized = items
    .map((b) => ({
      id: String(b.id ?? ""),
      title: String(b.title ?? ""),
      price: Number(b.price ?? 0),
      img: String(b.img ?? ""),
      author: String(b.author ?? ""),
      qty: normalizeQty(b.qty),
      status: String(b.status ?? "주문완료"),
      date: b.date ? String(b.date) : "-", // 혹시 넘어오면 사용
    }))
    .filter((b) => b.id && b.title);

  const next = [...normalized, ...orders];
  saveOrders(next);
  localStorage.removeItem(PENDING_KEY);
  return next;
}

// ===== 렌더 =====
function renderOrders(orders) {
  if (!tbody) return;

  if (!orders.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:20px; color:#666;">
          주문 내역이 없습니다.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = orders
    .map(
      (o) => `
      <tr>
        <td>
          <img src="${escapeHtml(o.img)}" alt="${escapeHtml(o.title)}" style="width:60px; height:auto;">
        </td>
        <td>${escapeHtml(o.id)}</td>
        <td>${formatPrice(o.price)}</td>
        <td>${escapeHtml(o.title)}</td>
        <td>${escapeHtml(o.author)}</td>
        <td>${escapeHtml(o.qty)}</td>
        <td><span class="status">${escapeHtml(o.status || "주문완료")}</span></td>
        <td>
          <button class="btn track-btn"
            data-id="${escapeHtml(o.id)}"
            data-title="${escapeHtml(o.title)}"
            data-author="${escapeHtml(o.author)}"
            data-qty="${escapeHtml(o.qty)}"
            data-status="${escapeHtml(o.status || "주문완료")}"
            data-date="${escapeHtml(o.date || "-")}">
            조회
          </button>
        </td>
      </tr>
    `
    )
    .join("");

  document.querySelectorAll(".track-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal({
        order: btn.dataset.id, // 주문번호 대신 책ID 보여주는 현재 방식 유지
        date: btn.dataset.date || "-",
        book: `${btn.dataset.title} (${btn.dataset.author})`,
        qty: btn.dataset.qty,
        status: btn.dataset.status,
      });
    });
  });
}

// ===== Modal =====
const modal = document.getElementById("trackModal");
const closeBtn = document.getElementById("closeBtn");

const mOrder = document.getElementById("mOrder");
const mDate = document.getElementById("mDate");
const mBook = document.getElementById("mBook");
const mQty = document.getElementById("mQty");
const mStatus = document.getElementById("mStatus");

function openModal(data) {
  if (!modal) return;
  if (mOrder) mOrder.textContent = data.order ?? "-";
  if (mDate) mDate.textContent = data.date ?? "-";
  if (mBook) mBook.textContent = data.book ?? "-";
  if (mQty) mQty.textContent = data.qty ?? "-";
  if (mStatus) mStatus.textContent = data.status ?? "-";
  modal.dataset.open = "true";
}

function closeModal() {
  if (!modal) return;
  modal.dataset.open = "false";
}

if (modal && closeBtn) {
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.dataset.open === "true") closeModal();
  });
} else {
  if (!modal) console.error("[myPage] trackModal 요소를 못 찾았어. HTML id='trackModal' 확인");
  if (!closeBtn) console.error("[myPage] closeBtn 요소를 못 찾았어. HTML id='closeBtn' 확인");
}

// ===== 실행 =====
if (!isLoggedIn()) {
  if (tbody) tbody.innerHTML = "";
  toast("로그인 후 이용해주세요.");
  closeModal();
} else {
  let orders = loadOrders();

  // ✅ 1) cart.js가 만든 orders를 먼저 흡수 (핵심)
  orders = importFromCartOrders(orders);

  // ✅ 2) (선택) pending도 흡수
  orders = consumePendingOrder(orders);

  renderOrders(orders);
}
