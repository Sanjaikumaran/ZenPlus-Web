let productList = [];

// Handle data received from Python
function handleDataFromPython(data) {
  console.log("Data received from Python:", data);
  productList = data; // Assign received data to productList
}

// Initialize WebChannel and event listeners
window.onload = function () {
  new QWebChannel(qt.webChannelTransport, function (channel) {
    window.handler = channel.objects.handler;
  });
};

// Ensure the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const addItemBtn = document.getElementById("add-item-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const holdBtn = document.getElementById("hold-btn");
  const printBtn = document.getElementById("print-btn");
  const productDetailsContainer = document.getElementById("productDetails");
  const productDetails = document.getElementById("product-details");
  const quantityInput = document.getElementById("quantityInput");
  const discountInput = document.getElementById("discountInput");
  const priceInput = document.getElementById("priceInput");
  const cartItems = document.getElementById("cart-items");
  const totalProducts = document.getElementById("total-products");
  const totalQuantity = document.getElementById("total-quantity");
  const totalPrice = document.getElementById("total-price");
  const totalDiscount = document.getElementById("total-discount");
  const totalTaxes = document.getElementById("total-taxes");
  const totalAmount = document.getElementById("total-amount");
  const customerModal = document.getElementById("customer-modal");
  const customerForm = document.getElementById("customer-form");
  const closeBtn = document.querySelector(".close-btn");
  const saveBtn = document.querySelector(".save-btn");
  const customerPrintBtn = document.querySelector(".print-btn");
  const customerCancelBtn = document.querySelector(".cancel-btn");
  const emptyCart = document.getElementById("empty-cart");
  let productIdValue;

  // Prevent closing dropdown when clicking inside it
  document.querySelectorAll("nav ul li").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target.closest(".dropdown")) return;

      document.querySelectorAll("nav ul li ul.dropdown").forEach((dropdown) => {
        if (dropdown !== item.querySelector("ul.dropdown")) {
          dropdown.style.display = "none";
        }
      });

      const dropdown = item.querySelector("ul.dropdown");
      if (dropdown) {
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest("nav")) {
      document.querySelectorAll("nav ul li ul.dropdown").forEach((dropdown) => {
        dropdown.style.display = "none";
      });
    }
  });

  let cart = [];

  function updateClock() {
    const now = new Date();
    const date = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeString = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    document.getElementById("clock").textContent = timeString;
  }

  // Update the clock immediately and every second
  updateClock();
  setInterval(updateClock, 1000);

  function updateCartSummary() {
    let totalProductsCount = 0;
    let totalQuantityCount = 0;
    let totalPriceAmount = 0;
    let totalDiscountAmount = 0;
    let totalTaxesAmount = 0;
    let totalAmountValue = 0;

    cart.forEach((item) => {
      totalProductsCount += 1;
      totalQuantityCount += item.quantity;
      totalPriceAmount += item.price * item.quantity;
      totalDiscountAmount += item.discount * item.quantity;
      totalTaxesAmount += item.taxes * item.quantity;
      totalAmountValue += item.total;
    });

    totalProducts.textContent = totalProductsCount;
    totalQuantity.textContent = totalQuantityCount;
    totalPrice.textContent = `₹ ${totalPriceAmount.toFixed(2)}`;
    totalDiscount.textContent = `₹ ${totalDiscountAmount.toFixed(2)}`;
    totalTaxes.textContent = `₹ ${totalTaxesAmount.toFixed(2)}`;
    totalAmount.textContent = `₹ ${totalAmountValue.toFixed(2)}`;
  }

  function addItemToCart(
    productDetails,
    productIdValue,
    quantity,
    discount,
    price
  ) {
    emptyCart?.remove();
    const [
      productName,
      productPrice,
      productId,
      productBrand,
    ] = productDetails.split(",");
    const taxes = (price - discount) * 0.05;
    const total = price - discount + taxes;

    const item = {
      productIdValue,
      productName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      discount: parseFloat(discount),
      taxes: parseFloat(taxes),
      total: parseFloat(total),
    };

    cart.push(item);

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <span>${cart.length}</span>
      <span>${item.productIdValue}</span>
      <span>${item.productName}</span>
      <span>${item.quantity}</span>
      <span>&#8377; ${item.price.toFixed(2)}</span>
      <span>&#8377; ${item.discount.toFixed(2)}</span>
      <span>&#8377; ${(item.price * item.quantity).toFixed(2)}</span>
      <span>&#8377; ${item.taxes.toFixed(2)}</span>
      <span>&#8377; ${item.total.toFixed(2)}</span>
      <span><button class="remove-btn">Remove</button></span>
    `;

    cartItems.appendChild(cartItem);

    updateCartSummary();
  }

  function filterProducts(query) {
    // Ensure the query is a string
    const queryStr = query.toString().toLowerCase();

    return productList.filter((product) => {
      // Ensure the product fields are strings and convert them to lowercase
      const productName = (product.ProductName || "").toLowerCase();
      const productID = (product.ProductID || "").toLowerCase();
      const brand = (product.Brand || "").toLowerCase();
      const price = (product.Price || "").toString().toLowerCase();

      // Check if any of the fields include the query string
      return (
        productName.includes(queryStr) ||
        productID.includes(queryStr) ||
        brand.includes(queryStr) ||
        price.includes(queryStr)
      );
    });
  }

  function showSuggestions(filteredProducts) {
    // Remove any existing suggestions box before creating a new one
    const existingSuggestionsBox = document.getElementById("suggestionsBox");
    if (existingSuggestionsBox) {
      existingSuggestionsBox.remove();
    }

    const suggestionsBox = document.createElement("div");
    suggestionsBox.className = "suggestions-box";
    suggestionsBox.id = "suggestionsBox";
    productDetailsContainer.appendChild(suggestionsBox);

    if (filteredProducts.length === 0) {
      const noMatchItem = document.createElement("div");
      noMatchItem.textContent = "No matching products found";
      suggestionsBox.appendChild(noMatchItem);
      return;
    }

    filteredProducts.forEach((product) => {
      const suggestionItem = document.createElement("div");

      suggestionItem.textContent = `${product.ProductID}, ${product.ProductName}, ${product.Brand}, ${product.SellingPrice}`;

      suggestionItem.addEventListener("click", () => {
        productDetails.value = product.ProductName;
        priceInput.value = product.SellingPrice;
        discountInput.value = product.Discount;
        quantityInput.value = "1";
        productIdValue = product.ProductID;

        // Remove all suggestion-related elements
        suggestionsBox.remove();
      });

      suggestionsBox.appendChild(suggestionItem);
    });
  }

  productDetails.addEventListener("input", (event) => {
    const query = event.target.value;
    const suggestionsBox = document.getElementById("suggestionsBox");

    if (query.length > 0) {
      const filteredProducts = filterProducts(query);
      showSuggestions(filteredProducts);
    } else {
      if (suggestionsBox) {
        suggestionsBox.remove();
      }
    }
  });

  addItemBtn.addEventListener("click", () => {
    const product = productDetails.value;
    const quantity = quantityInput.value;
    const discount = discountInput.value;
    const price = priceInput.value;

    if (product && quantity && discount && price) {
      addItemToCart(product, productIdValue, quantity, discount, price);

      productDetails.value = "";
      quantityInput.value = "";
      discountInput.value = "";
      priceInput.value = "";
    }
  });

  clearCartBtn.addEventListener("click", () => {
    cart = [];
    cartItems.innerHTML = "";
    cartItems.appendChild(emptyCart);
    updateCartSummary();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (customerModal.style.display === "block") {
        customerPrintBtn.click();
      } else {
        const product = productDetails.value;
        const quantity = quantityInput.value;
        const discount = discountInput.value;
        const price = priceInput.value;
        if (product && quantity && discount && price) {
          addItemBtn.click();
        }
      }
    }
    if (event.ctrlKey && event.key == "s") {
      event.preventDefault();
      console.log("Saved");
    }
    if (event.ctrlKey && event.key == "h") {
      event.preventDefault();
      console.log("Holded");
    }
    if (event.key === "Escape") {
      if (customerModal.style.display === "block") {
        customerModal.style.display = "none";
      } else {
        cart = [];
        cartItems.innerHTML = "";
        cartItems.appendChild(emptyCart);
        updateCartSummary();
      }
    }
    if (event.ctrlKey && event.key === "p") {
      event.preventDefault();
      customerModal.style.display = "block";
    }
  });

  holdBtn.addEventListener("click", () => {
    // Implement hold functionality
  });

  printBtn.addEventListener("click", () => {
    // Implement print functionality
  });

  closeBtn.addEventListener("click", () => {
    customerModal.style.display = "none";
  });

  saveBtn.addEventListener("click", () => {
    customerModal.style.display = "none";
    // Save customer details functionality
  });

  customerCancelBtn.addEventListener("click", () => {
    customerModal.style.display = "none";
  });

  customerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    customerModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === customerModal) {
      customerModal.style.display = "none";
    }
  });

  // Show the customer modal (you can trigger this based on your logic)
  printBtn.addEventListener("click", () => {
    customerModal.style.display = "block";
  });
});
