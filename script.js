
/* ============================================
   LUNARA — SHOPPING BAG & CHECKOUT
   Fixed product image paths
============================================ */

// PRODUCT DATABASE
// These image paths now match the images in your HTML.

const products = {
  pearl: {
    id: "pearl",
    name: "Pearl Current Earrings",
    price: 48,
    image: "./images/Goldearring-1.jpg"
  },

  sculpture: {
    id: "sculpture",
    name: "Sculpture Loop Earrings",
    price: 52,
    image: "./images/pearl-sculpture-earrings.jpg"
  },

  horizon: {
    id: "horizon",
    name: "Golden Horizon Necklace",
    price: 75,
    image: "./images/set-2.jpg"
  },

  celestial: {
    id: "celestial",
    name: "Celestial Pendant",
    price: 68,
    image: "./images/pendant1.jpg"
  },

  aurora: {
    id: "aurora",
    name: "Aurora Gold Bracelet",
    price: 59,
    image: "./images/braceleet1.jpg"
  },

  eternal: {
    id: "eternal",
    name: "Eternal Glow Ring",
    price: 45,
    image: "./images/ring-1.jpg"
  },

  moonlight: {
    id: "moonlight",
    name: "Moonlight Pearl Necklace",
    price: 89,
    image: "./images/necklacee1.jpg"
  },

  solstice: {
    id: "solstice",
    name: "Solstice Statement Earrings",
    price: 65,
    image: "./images/set-8.jpg"
  }
};


// SHOPPING BAG

let bag = [];


// ELEMENTS

const bagCount = document.getElementById("bagCount");
const bagHeaderCount = document.getElementById("bagHeaderCount");

const bagDrawer = document.getElementById("bagDrawer");
const bagItems = document.getElementById("bagItems");
const overlay = document.getElementById("overlay");

const subtotalElement = document.getElementById("subtotal");
const shippingElement = document.getElementById("shipping");
const totalElement = document.getElementById("total");
const shippingMessage = document.getElementById("shippingMessage");

const checkoutButton = document.getElementById("checkoutButton");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const checkoutTotal = document.getElementById("checkoutTotal");

const checkoutForm = document.getElementById("checkoutForm");
const successOverlay = document.getElementById("successOverlay");
const orderNumber = document.getElementById("orderNumber");


// ============================================
// LOCAL STORAGE
// ============================================

function saveBag() {
  localStorage.setItem("lunaraBag", JSON.stringify(bag));
}


function loadBag() {
  try {
    const savedBag = JSON.parse(
      localStorage.getItem("lunaraBag")
    );

    if (Array.isArray(savedBag)) {

      bag = savedBag
        .filter(item =>
          products[item.id] &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0
        )
        .map(item => ({
          ...products[item.id],
          quantity: item.quantity
        }));

    }

  } catch (error) {
    console.error("Could not load shopping bag:", error);
    bag = [];
  }

  // Save the corrected product information.
  saveBag();
}


// ============================================
// ADD PRODUCT TO BAG
// ============================================

document.querySelectorAll(".quick-add").forEach(button => {

  button.addEventListener("click", () => {

    const productId = button.dataset.product;
    const product = products[productId];

    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    const existingItem = bag.find(
      item => item.id === productId
    );

    if (existingItem) {

      existingItem.quantity += 1;

    } else {

      bag.push({
        ...product,
        quantity: 1
      });

    }

    saveBag();
    renderBag();
    openBag();

    const originalText = button.textContent;

    button.textContent = "Added ✓";

    setTimeout(() => {
      button.textContent = originalText;
    }, 1200);

  });

});


// ============================================
// RENDER SHOPPING BAG
// ============================================

function renderBag() {

  bagItems.innerHTML = "";

  if (bag.length === 0) {

    bagItems.innerHTML = `
      <p class="empty-bag">
        Your bag is currently empty.
      </p>
    `;

  }

  bag.forEach(item => {

    const itemElement = document.createElement("div");

    itemElement.className = "bag-item";

    itemElement.innerHTML = `
      <img
        src="${item.image}"
        alt="${item.name}"
        class="bag-product-image"
        onerror="this.style.display='none'; console.error('Image not found:', this.src);"
      >

      <div class="bag-item-info">

        <h3>${item.name}</h3>

        <p>€${item.price.toFixed(2)}</p>

        <div class="bag-item-controls">

          <button
            class="quantity-button"
            data-action="decrease"
            data-id="${item.id}"
            aria-label="Decrease quantity"
          >−</button>

          <span class="quantity">${item.quantity}</span>

          <button
            class="quantity-button"
            data-action="increase"
            data-id="${item.id}"
            aria-label="Increase quantity"
          >+</button>

          <button
            class="remove-button"
            data-action="remove"
            data-id="${item.id}"
          >Remove</button>

        </div>

      </div>
    `;

    bagItems.appendChild(itemElement);

  });

  updateTotals();
}


// ============================================
// INCREASE / DECREASE / REMOVE
// ============================================

bagItems.addEventListener("click", event => {

  const button = event.target.closest("button");

  if (!button) return;

  const productId = button.dataset.id;
  const action = button.dataset.action;

  const item = bag.find(
    product => product.id === productId
  );

  if (!item) return;

  if (action === "increase") {

    item.quantity += 1;

  }

  if (action === "decrease") {

    item.quantity -= 1;

    if (item.quantity <= 0) {

      bag = bag.filter(
        product => product.id !== productId
      );

    }

  }

  if (action === "remove") {

    bag = bag.filter(
      product => product.id !== productId
    );

  }

  saveBag();
  renderBag();

});


// ============================================
// CALCULATE TOTALS
// ============================================

function updateTotals() {

  const quantity = bag.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = bag.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping =
    subtotal === 0 || subtotal >= 75
      ? 0
      : 5.95;

  const total = subtotal + shipping;

  bagCount.textContent = quantity;

  bagHeaderCount.textContent = `(${quantity})`;

  subtotalElement.textContent =
    `€${subtotal.toFixed(2)}`;

  shippingElement.textContent =
    `€${shipping.toFixed(2)}`;

  totalElement.textContent =
    `€${total.toFixed(2)}`;

  checkoutTotal.textContent =
    `€${total.toFixed(2)}`;

  checkoutButton.disabled = bag.length === 0;

  if (subtotal === 0) {

    shippingMessage.textContent =
      "Add products to your bag to begin.";

  } else if (subtotal >= 75) {

    shippingMessage.textContent =
      "Congratulations! You qualify for free shipping.";

  } else {

    shippingMessage.textContent =
      `Add €${(75 - subtotal).toFixed(2)} more for free shipping.`;

  }

}


// ============================================
// OPEN & CLOSE BAG
// ============================================

function openBag() {

  bagDrawer.classList.add("active");
  overlay.classList.add("active");
  document.body.classList.add("no-scroll");

}


function closeBag() {

  bagDrawer.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("no-scroll");

}


document.getElementById("openBag")
  .addEventListener("click", openBag);

document.getElementById("closeBag")
  .addEventListener("click", closeBag);

overlay.addEventListener("click", closeBag);


// ============================================
// OPEN CHECKOUT
// ============================================

checkoutButton.addEventListener("click", () => {

  if (bag.length === 0) return;

  closeBag();

  checkoutOverlay.classList.add("active");
  document.body.classList.add("no-scroll");

});


// ============================================
// CLOSE CHECKOUT
// ============================================

document.getElementById("closeCheckout")
  .addEventListener("click", () => {

    checkoutOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");

  });


checkoutOverlay.addEventListener("click", event => {

  if (event.target === checkoutOverlay) {

    checkoutOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");

  }

});


// ============================================
// PLACE DEMO ORDER
// ============================================

checkoutForm.addEventListener("submit", event => {

  event.preventDefault();

  if (bag.length === 0) {

    alert("Your shopping bag is empty.");
    return;

  }

  const randomNumber = Math.floor(
    100000 + Math.random() * 900000
  );

  orderNumber.textContent =
    `Order Reference: LUN-${randomNumber}`;

  checkoutOverlay.classList.remove("active");
  successOverlay.classList.add("active");

  bag = [];

  saveBag();
  renderBag();

  checkoutForm.reset();

});


// ============================================
// FINISH ORDER
// ============================================

document.getElementById("finishOrder")
  .addEventListener("click", () => {

    successOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");

  });


// ============================================
// NEWSLETTER DEMO
// ============================================

document.getElementById("newsletterForm")
  .addEventListener("submit", event => {

    event.preventDefault();

    alert("Thank you for joining the LUNARA newsletter!");

    event.target.reset();

  });


// ============================================
// INITIALIZE WEBSITE
// ============================================

loadBag();
renderBag();
