
// 책(상품) 정보: 바뀌지 않는 값

const testbook = {
    id: "0001",
    title: "테스트북",
    price: 15000,
    img: "../../assets/imgs/book1.jpg",
    detailUrl: "detailPage.html?id=0001",
    category: "국내도서",
    author: "홍길동",
    stock: 100
};

const CART_KEY = "cartItems";// key 상수

function getCartItems() {//장바구니 전체 읽기
    try {
        const raw = localStorage.getItem(CART_KEY);//객체의 아이템들 문자열로 저장
        const arr = raw ? JSON.parse(raw) : [];//저장된게 있으면 객체로 저장
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

function setCartItems(items) {// 장바구니 전체 저장
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function clearCart() { //장바구니 초기화(비우기)
    localStorage.removeItem(CART_KEY);
}

function addToCartOnce(book) {
    const items = getCartItems();

    const exists = items.some(it => it.id === book.id);
    if (exists) {
        console.log("이미 담김");
        return { ok: false, reason: "EXISTS" };
    }

    // 구매수량은 장바구니 기본값 1 (나중에 구매페이지에서 수정)
    const cartItem = { ...book, qty: 1 };
    items.push(cartItem);

    setCartItems(items);
    console.log("담김 성공:", items);
}

function logCart() {
    console.log("cartItems =", getCartItems());
    console.log("raw =", localStorage.getItem(CART_KEY));
}

document.getElementById("btnAddCart").addEventListener("click", () => {
    addToCartOnce(testbook);
    location.href = "../cart/cart.html";
});
// clearCart();
// addToCartOnce(testbook);
// logCart(); 


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