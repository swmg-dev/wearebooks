// assets/js/store.js (전역 스크립트, export 없음 / 유저별 orders 지원)

const LOGIN_ID_KEY = "loginUserId";

const WEARE_CART_KEY = "weAre_cart"; // (장바구니는 유저별로 분리 안 해도 됨. 원하면 분리 가능)
const WEARE_ORDERS_BASE = "weAre_orders"; // 실제 키: weAre_orders:<userId>
const WEARE_PENDING_BASE = "weAre_pending_order"; // 실제 키: weAre_pending_order:<userId>

function getLoginUserId() {
  return localStorage.getItem(LOGIN_ID_KEY) || "";
}

function ordersKey(userId = getLoginUserId()) {
  return userId ? `${WEARE_ORDERS_BASE}:${userId}` : WEARE_ORDERS_BASE;
}

function pendingKey(userId = getLoginUserId()) {
  return userId ? `${WEARE_PENDING_BASE}:${userId}` : WEARE_PENDING_BASE;
}

function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeQty(qty) {
  const n = parseInt(qty, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function normalizeBook(book, qty = 1) {
  return {
    id: String(book?.id ?? ""),
    title: String(book?.title ?? ""),
    price: Number(book?.price ?? 0),
    img: String(book?.img ?? ""),
    detailUrl: String(book?.detailUrl ?? ""),
    category: String(book?.category ?? ""),
    author: String(book?.author ?? ""),
    qty: normalizeQty(qty ?? book?.qty),
  };
}

// ----- Cart -----
function getCart() {
  return safeParse(localStorage.getItem(WEARE_CART_KEY), []);
}
function setCart(cart) {
  localStorage.setItem(WEARE_CART_KEY, JSON.stringify(cart));
}
function addToCart(book, qty = 1) {
  const cart = getCart();
  const b = normalizeBook(book, qty);
  if (!b.id) return cart;

  const idx = cart.findIndex((it) => String(it.id) === b.id);
  if (idx >= 0) cart[idx].qty += b.qty;
  else cart.push(b);

  setCart(cart);
  return cart;
}

// ----- Orders (유저별) -----
function getOrders(userId) {
  return safeParse(localStorage.getItem(ordersKey(userId)), []);
}
function setOrders(orders, userId) {
  localStorage.setItem(ordersKey(userId), JSON.stringify(orders));
}

// cart -> orders 저장(유저별)
function checkout(status = "주문완료") {
  const userId = getLoginUserId();
  if (!userId) return []; // 로그인 안 했으면 주문 저장 안 함

  const cart = getCart();
  if (!cart.length) return [];

  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const existing = getOrders(userId);
  const newOrders = cart.map((item) => ({
    ...item,
    status,
    date,
  }));

  setOrders([...newOrders, ...existing], userId);
  setCart([]); // 주문 완료 후 장바구니 비움
  return newOrders;
}

// ----- Pending (유저별) : myPage에서 1회 소비 -----
function setPendingOrder(orderOrArray) {
  const userId = getLoginUserId();
  if (!userId) return;
  localStorage.setItem(pendingKey(userId), JSON.stringify(orderOrArray));
}

function consumePendingOrder() {
  const userId = getLoginUserId();
  if (!userId) return null;

  const k = pendingKey(userId);
  const raw = localStorage.getItem(k);
  if (!raw) return null;

  localStorage.removeItem(k);
  return safeParse(raw, null);
}

// 전역 노출
window.WEARE = {
  getLoginUserId,
  ordersKey,
  pendingKey,
  getCart,
  setCart,
  addToCart,
  getOrders,
  setOrders,
  checkout,
  setPendingOrder,
  consumePendingOrder,
};
