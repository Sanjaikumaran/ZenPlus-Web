document.addEventListener("DOMContentLoaded", () => {
  const addItemBtn = document.getElementById("add-item-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const holdBtn = document.getElementById("hold-btn");
  const printBtn = document.getElementById("print-btn");
  const productDetails = document.getElementById("product-details");
  const quantityInput = document.getElementById("quantity");
  const discountInput = document.getElementById("discount");
  const priceInput = document.getElementById("price");
  const suggestionsBox = document.getElementById("suggestions");
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
  document.querySelectorAll('nav ul li').forEach(item => {
    item.addEventListener('click', event => {
        // Prevent closing the dropdown when clicking inside it
        if(event.target.closest('.dropdown')) return;

        // Hide all other open dropdowns
        document.querySelectorAll('nav ul li ul.dropdown').forEach(dropdown => {
            if (dropdown !== item.querySelector('ul.dropdown')) {
                dropdown.style.display = 'none';
            }
        });

        // Toggle the current dropdown
        const dropdown = item.querySelector('ul.dropdown');
        if (dropdown) {
            dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
        }
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', event => {
    if (!event.target.closest('nav')) {
        document.querySelectorAll('nav ul li ul.dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
});

  let cart = [];
  const products = [
    { name: "Product1", price: 100, id: "001", brand: "BrandA" },
    { name: "Product1", price: 100, id: "001", brand: "BrandA" },
    { name: "Product1", price: 100, id: "001", brand: "BrandA" },
    { name: "Product1", price: 100, id: "001", brand: "BrandA" },
    { name: "Product1", price: 100, id: "001", brand: "BrandA" },
    { name: "Product2", price: 200, id: "002", brand: "BrandB" },
    { name: "Product3", price: 150, id: "003", brand: "BrandC" },
    // Add more products as needed
  ];
  function updateClock() {
    const now = new Date();
    const date = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeString = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    document.getElementById("clock").textContent = timeString;
  }

  // Update the clock immediately
  updateClock();
  // Update the clock every second
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

  function addItemToCart(productDetails, quantity, discount, price) {
    document.getElementById("empty-cart").style.display="none";
    const [
      productName,
      productPrice,
      productId,
      productBrand,
    ] = productDetails.split(",");
    const taxes = (price - discount) * 0.05; // Example tax calculation
    const total = price - discount + taxes;

    const item = {
      productId,
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
          <span>${item.productId}</span>
          <span>${item.productName}</span>
          <span>${item.quantity}</span>
          <span>&#8377; ${item.price.toFixed(2)} </span>
          <span>&#8377; ${item.discount.toFixed(2)} </span>
          <span>&#8377; ${(item.price * item.quantity).toFixed(2)} </span>
          <span>&#8377; ${item.taxes.toFixed(2)} </span>
          <span>&#8377; ${item.total.toFixed(2)} </span>
          <span><button class="remove-btn">Remove</button></span>
      `;

    cartItems.appendChild(cartItem);

    updateCartSummary();
  }

  function filterProducts(query) {
    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  function showSuggestions(filteredProducts) {
    suggestionsBox.innerHTML = "";
    filteredProducts.forEach((product) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.textContent = `${product.name} (${product.price}, ${product.id}, ${product.brand})`;
      suggestionItem.addEventListener("click", () => {
        suggestionsBox.style.display = "none";
        productDetails.value = `${product.name}`;
        priceInput.value = product.price;

        discountInput.value = "0"; // Default discount to 0
        quantityInput.value = "1"; // Default quantity to 1
        suggestionsBox.innerHTML = ""; // Clear suggestions
      });
      suggestionsBox.appendChild(suggestionItem);
    });
  }

  productDetails.addEventListener("input", (event) => {
    const query = event.target.value;
    if (query.length > 0) {
      const filteredProducts = filterProducts(query);
      showSuggestions(filteredProducts);
      suggestionsBox.style.display = "block";
    } else {
      suggestionsBox.innerHTML = ""; // Clear suggestions if input is empty
      suggestionsBox.style.display = "none";
    }
  });

  addItemBtn.addEventListener("click", () => {
    const product = productDetails.value;
    const quantity = quantityInput.value;
    const discount = discountInput.value;
    const price = priceInput.value;

    if (product && quantity && discount && price) {
      addItemToCart(product, quantity, discount, price);

      productDetails.value = "";
      quantityInput.value = "";
      discountInput.value = "";
      priceInput.value = "";
    }
  });

  document.addEventListener("keydown", function (event) {
    
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default action (if any) associated with the Enter key
      if (customerModal.style.display === "block") {
        customerPrintBtn.click()
      }
      else{
      const product = productDetails.value;
      const quantity = quantityInput.value;
      const discount = discountInput.value;
      const price = priceInput.value;
      if (product && quantity && discount && price) {
        addItemBtn.click();
      }
      }

    }
    if(event.ctrlKey && event.key=="s"){
      event.preventDefault(); // Prevent the default action (if any) associated with Ctrl+P

      console.log("Saved")
    }
    if(event.ctrlKey && event.key=="h"){
      event.preventDefault(); // Prevent the default action (if any) associated with Ctrl+P

      console.log("Holded")
    }
    if (event.key === "Escape") {
      
      if (customerModal.style.display === "block") {
        customerModal.style.display = "none";
      }
      else{
        cart = [];
        document.getElementById("empty-cart").style.display="flex";
      cartItems.innerHTML = "";
      updateCartSummary();

      }
      // Add your additional logic here if needed
    }
    if (event.ctrlKey && event.key === "p") {
      event.preventDefault(); // Prevent the default action (if any) associated with Ctrl+P
      customerModal.style.display = "block";
      // Add your additional logic here if needed
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
    // Handle customer form submission
    customerModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === customerModal) {
      customerModal.style.display = "none";
    }
  });

  // Show the customer modal (you can trigger this based on your logic)
  document.getElementById("print-btn").addEventListener("click", () => {
    customerModal.style.display = "block";
  });
});
