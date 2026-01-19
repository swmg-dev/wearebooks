// memberInfo.js (users 키를 직접 수정하는 버전)

const LOGIN_ID_KEY = "loginUserId";
const USERS_KEY = "users";
const LOGIN_NAME_KEY = "loginUserName"; // (선택)

const form = document.getElementById("profileForm");

const userIdEl = document.getElementById("userId");
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const phoneEl = document.getElementById("phone");
const addrEl = document.getElementById("addr");
const addrDetailEl = document.getElementById("addrDetail");

const resetBtn = document.getElementById("resetBtn");
const toastEl = document.getElementById("toast");

function toast(msg, ms = 1400) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("is-show");
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove("is-show"), ms);
}

function getLoginUserId() {
  return localStorage.getItem(LOGIN_ID_KEY) || "";
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// signup.js는 address를 "addr1 addr2" 한 줄로 저장했음.
// memberInfo는 addr/addrDetail 분리 input이라서 표시용으로 나눠줌(완벽 분리는 어려움)
function splitAddress(address) {
  const s = String(address || "").trim();
  if (!s) return { addr: "", addrDetail: "" };

  // 가장 단순한 전략: 마지막 토큰을 상세주소로 보고 분리
  const parts = s.split(/\s+/);
  if (parts.length <= 1) return { addr: s, addrDetail: "" };

  const addrDetail = parts.pop();
  const addr = parts.join(" ");
  return { addr, addrDetail };
}

function joinAddress(addr, addrDetail) {
  const a = String(addr || "").trim();
  const d = String(addrDetail || "").trim();
  return [a, d].filter(Boolean).join(" ");
}

function fillForm(user, userId) {
  // ✅ 아이디: 흐리게(placeholder)
  userIdEl.value = "";
  userIdEl.placeholder = userId;

  nameEl.value = user?.name || "";
  // email/phone은 기존 users 스키마에 없어서 없으면 빈칸
  emailEl.value = user?.email || "";
  phoneEl.value = user?.phone || "";

  const { addr, addrDetail } = splitAddress(user?.address);
  addrEl.value = addr;
  addrDetailEl.value = addrDetail;
}

function disableForm() {
  [nameEl, emailEl, phoneEl, addrEl, addrDetailEl, resetBtn].forEach((el) => {
    if (el) el.disabled = true;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const userId = getLoginUserId();
  if (!userId) {
    fillForm(null, "");
    toast("로그인 후 이용해주세요.");
    disableForm();
    return;
  }

  let users = getUsers();
  let idx = users.findIndex((u) => u.id === userId);

  if (idx < 0) {
    toast("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
    disableForm();
    userIdEl.placeholder = userId;
    return;
  }

  // 초기 채우기
  fillForm(users[idx], userId);

  // 초기화: 저장된(users) 상태로 복원
  resetBtn.addEventListener("click", () => {
    users = getUsers();
    idx = users.findIndex((u) => u.id === userId);
    fillForm(users[idx], userId);
    toast("초기화 완료");
  });

  // 저장: users 배열 수정 후 다시 저장
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl.value.trim();
    const addr = addrEl.value.trim();
    const addrDetail = addrDetailEl.value.trim();

    if (!name) return toast("이름을 입력해주세요.");
    if (!email) return toast("이메일을 입력해주세요.");

    users = getUsers();
    idx = users.findIndex((u) => u.id === userId);
    if (idx < 0) return toast("사용자 정보를 찾을 수 없습니다.");

    users[idx] = {
      ...users[idx],
      name,
      email,
      phone,
      address: joinAddress(addr, addrDetail),
      updatedAt: new Date().toISOString(),
    };

    setUsers(users);

    // (선택) 헤더 표시용 캐시도 즉시 갱신
    localStorage.setItem(LOGIN_NAME_KEY, name);

    toast("저장되었습니다!");
  });
});
