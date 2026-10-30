const swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const hamburger = document.querySelector(".ham-burger");
const mobileMenu = document.querySelector(".mobile-menu");
const bars = document.querySelector(".fa-bars");

// Safe Check: Only run if elements exist on the page
if (hamburger && mobileMenu && bars) {
  hamburger.addEventListener("click", () => {
    // 1. Toggle the mobile menu visibility
    mobileMenu.classList.toggle("mobile-menu-active");

    // 2. Toggle BOTH classes so it switches between ☰ and ✕ cleanly
    bars.classList.toggle("fa-bars");
    bars.classList.toggle("fa-xmark");
  });
}

cartIcon.addEventListener("click", () => {
  cartTab.classList.add("cart-tab-active");
});

const closeBtn = document.querySelector(".close-btn");

closeBtn.addEventListener("click", () => {
  cartTab.classList.remove("cart-tab-active");
});

let productList = [];
let cartProducts = [];

const updateTotal = () => {
  let totalPrice = 0;
  let totalQuantity = 0;

  // FIXED: Changed ".item-total" to ".item" to loop through the full cart row
  document.querySelectorAll(".item").forEach((item) => {
    const quantityElement = item.querySelector(".quantity-value");
    const quantity = quantityElement
      ? parseInt(quantityElement.textContent)
      : 0;

    // FIXED: Target the specific ".item-total" inside this item row to get the price
    const priceElement = item.querySelector(".item-total");
    const price = priceElement
      ? parseFloat(priceElement.textContent.replace("$", ""))
      : 0;

    totalPrice += price;
    totalQuantity += quantity;
  });

  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;
};

const showCards = () => {
  productList.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("order-card");

    card.innerHTML = `
      <div class="card-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <h4>${product.name}</h4>
      <h4 class="price">${product.price}</h4>
      <a href="#" class="btn card-btn">Add to Cart</a>
    `;

    document.querySelector(".card-list").appendChild(card);

    const addToCartBtn = card.querySelector(".card-btn");

    addToCartBtn.addEventListener("click", (event) => {
      event.preventDefault();
      addToCart(product);
    });
  });
};

const addToCart = (product) => {
  const cartItem = document.createElement("div");
  cartItem.classList.add("item");
  const existingItem = cartProducts.find((item) => item.id === product.id);

  if (existingItem) {
    alert("This item is already in the cart.");
    return;
  }
  cartProducts.push(product);
  let quantity = 1;
  let price = parseFloat(product.price.replace("$", ""));
  cartItem.innerHTML = ` <div class="item-image">
                  <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="detail">
                  <h4>${product.name}</h4>
                  <h4 class="item-total">${product.price}</h4>
                </div>
                <div class=" flex ">
                  <a href="#" class="quantity-btn minus">
                    <i class="fa-solid fa-minus"></i>
                  </a>
                  <h4 class="quantity-value">1</h4>
                  <a href="#" class="quantity-btn plus">
                    <i class="fa-solid fa-plus"></i>
                  </a>
                </div>`;
  cartList.appendChild(cartItem);
  updateTotal();

  const plusBtn = cartItem.querySelector(".plus");
  const itemTotal = cartItem.querySelector(".item-total");
  const minusBtn = cartItem.querySelector(".minus");
  const quantityValue = cartItem.querySelector(".quantity-value");
  plusBtn.addEventListener("click", (event) => {
    event.preventDefault();
    quantity++;
    quantityValue.textContent = quantity;
    itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
    updateTotal();
  });
  minusBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
      itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
      updateTotal();
    } else {
      if (cartItem.classList.contains("slid-out")) return;

      cartItem.classList.add("slid-out");
      setTimeout(() => {
        cartList.removeChild(cartItem);
        cartProducts = cartProducts.filter((item) => item.id !== product.id);
        updateTotal();
      }, 300);
    }
  });
};
const initApp = () => {
  fetch("products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load products.json");
      }
      return response.json();
    })
    .then((data) => {
      productList = data;
      showCards();
    })
    .catch((error) => console.error("Error fetching products:", error));
};

initApp();
