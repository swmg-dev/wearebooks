// assets/js/signup.js
// 회원가입: 정규표현식 검증 + localStorage에 사용자 저장 + 완료 후 login.html로 이동

const form = document.getElementById("signupForm");

const idEl = document.getElementById("signupId");
const pwEl = document.getElementById("signupPw");
const pw2El = document.getElementById("signupPw2");
const nameEl = document.getElementById("signupName");
const addr1El = document.getElementById("signupAddr1");
const addr2El = document.getElementById("signupAddr2");

const idError = document.getElementById("idError");
const pwError = document.getElementById("pwError");
const pw2Error = document.getElementById("pw2Error");
const nameError = document.getElementById("nameError");
const addrError = document.getElementById("addrError");

// ✅ 아이디: 8~12자, 영문+숫자 둘 다 포함
const ID_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;

// ✅ 비밀번호: 8~12자, 영문+숫자+특수문자 모두 포함
// 특수문자는 흔히 쓰는 범위로 제한
const PW_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]{8,12}$/;

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
}

function hideError(el) {
  if (!el) return;
  el.textContent = "";
  el.style.display = "none";
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("users")) || [];
  } catch {
    return [];
  }
}

function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function isDuplicateId(id) {
  const users = getUsers();
  return users.some(u => u.id === id);
}

function clearAllErrors() {
  [idError, pwError, pw2Error, nameError, addrError].forEach(hideError);
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAllErrors();

    const id = (idEl?.value || "").trim();
    const pw = (pwEl?.value || "").trim();
    const pw2 = (pw2El?.value || "").trim();
    const name = (nameEl?.value || "").trim();
    const addr1 = (addr1El?.value || "").trim();
    const addr2 = (addr2El?.value || "").trim();

    let ok = true;

    // 아이디 검증
    if (!ID_REGEX.test(id)) {
      showError(idError, "아이디는 8~12자 영문+숫자 조합(둘 다 포함)이어야 합니다.");
      ok = false;
    } else if (isDuplicateId(id)) {
      showError(idError, "이미 사용 중인 아이디입니다.");
      ok = false;
    }

    // 비밀번호 검증
    if (!PW_REGEX.test(pw)) {
      showError(pwError, "비밀번호는 8~12자 영문+숫자+특수문자 조합(셋 다 포함)이어야 합니다.");
      ok = false;
    }

    // 비밀번호 확인
    if (pw !== pw2) {
      showError(pw2Error, "비밀번호가 일치하지 않습니다.");
      ok = false;
    }

    // 이름
    if (!name) {
      showError(nameError, "이름을 입력해주세요.");
      ok = false;
    }

    // 주소
    if (!addr1 || !addr2) {
      showError(addrError, "주소와 상세주소를 모두 입력해주세요.");
      ok = false;
    }

    if (!ok) return;

    // ✅ 저장 (실서비스면 서버로 전송해야 함 / 지금은 로컬 저장)
    const users = getUsers();
    users.push({
      id,
      pw,        // ⚠️ 실제 서비스에서는 절대 평문 저장하면 안 됨(학습용/과제용이라 임시)
      name,
      address: `${addr1} ${addr2}`,
      createdAt: new Date().toISOString()
    });
    setUsers(users);

    alert("회원가입이 완료되었습니다! 로그인 화면으로 이동합니다.");

    // ✅ 회원가입 후 로그인 페이지로 이동
    location.href = "login.html";
  });
}


function isLoggedIn() { return Boolean(localStorage.getItem("accessToken")); }

