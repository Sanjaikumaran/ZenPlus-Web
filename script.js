

let productList = [],
  data = [];
let handler, headers;

function load_Table(tableName, columns) {
  new QWebChannel(qt.webChannelTransport, function (channel) {
    handler = channel.objects.handler;

    
    if (handler && typeof handler.loadTable === "function") {
      handler.loadTable(tableName);
    } else {
      console.error(
        "Handler or handler.loadTable is not defined or not a function."
      );
    }
  });
}


function handleDataFromPython(tableData) {
  console.log("Data received from Python:", tableData);
  productList = data = tableData; 
  if (searchInput) {
    initializeTable(data); 
  }
}



{
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

  document.addEventListener("click", (event) => {
    if (!event.target.closest("nav")) {
      document.querySelectorAll("nav ul li ul.dropdown").forEach((dropdown) => {
        dropdown.style.display = "none";
      });
    }
  });

  function createModal(modalName, headers, inputData) {
    
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalTitle = document.createElement("h2");
    modalTitle.innerHTML = `${modalName} <span class="close-btn">&times;</span>`;

    const modalForm = document.createElement("form");
    modalForm.className = "modal-form";

    const formAction = document.createElement("div");
    formAction.className = "form-actions";

    const saveBtn = document.createElement("button");
    saveBtn.id = "save-btn";
    saveBtn.textContent = "Save";

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.id = "cancel-btn";
    closeBtn.textContent = "Close";

    formAction.appendChild(closeBtn);
    formAction.appendChild(saveBtn);

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalForm);
    modalContent.appendChild(formAction);
    modal.appendChild(modalContent);

    
    headers.forEach((header) => {
      const label = document.createElement("label");
      label.textContent = header;

      const input = document.createElement("input");
      input.type = "text";
      input.name = header;
      if (inputData) {
        input.value = inputData[header];
      }

      modalForm.appendChild(label);
      modalForm.appendChild(input);
    });

    document.body.appendChild(modal);

    
    modal.style.display = "flex";

    
    closeBtn.addEventListener("click", () => {
      modal.remove();
    });

    saveBtn.addEventListener("click", () => {
      const formData = new FormData(modalForm);
      const rowData = {};
      formData.forEach((value, key) => {
        rowData[key] = value;
      });

      if (currentRowIndex === null) {
        data.push(rowData);
      } else {
        data[currentRowIndex] = rowData;
      }
      renderTableRows(data);
      modal.remove();
    });
    modal.querySelector(".close-btn").addEventListener("click", () => {
      modal.remove();
    });
  }
}

{
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  const clock = document.getElementById("clock");
  const addItemBtn = document.getElementById("add-item-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const productDetailsContainer = document.getElementById("productDetails");
  const productDetails = document.getElementById("product-details");
  const emptyCart = document.getElementById("empty-cart");
  const cartItems = document.getElementById("cart-items");
  const totalProducts = document.getElementById("total-products");
  const totalQuantity = document.getElementById("total-quantity");
  const totalPrice = document.getElementById("total-price");
  const totalDiscount = document.getElementById("total-discount");
  const totalTaxes = document.getElementById("total-taxes");
  const totalAmount = document.getElementById("total-amount");
  const holdBtn = document.getElementById("hold-btn");
  const printBtn = document.getElementById("print-btn");

  function updateClock() {
    const now = new Date();
    const date = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeString = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    clock.textContent = timeString;
  }
  if (clock) {
    updateClock();
    setInterval(updateClock, 1000);
  }

  let cart = [];
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
    const queryStr = query.toString().toLowerCase();

    return productList.filter((product) => {
      const productName = (product.ProductName || "").toLowerCase();
      const productID = (product.ProductID || "").toLowerCase();
      const brand = (product.Brand || "").toLowerCase();
      const price = (product.Price || "").toString().toLowerCase();

      return (
        productName.includes(queryStr) ||
        productID.includes(queryStr) ||
        brand.includes(queryStr) ||
        price.includes(queryStr)
      );
    });
  }

  function showSuggestions(filteredProducts) {
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

        suggestionsBox.remove();
      });

      suggestionsBox.appendChild(suggestionItem);
    });
  }
  if (productDetails) {
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
  }

  if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
      const product = productDetails.value;
      const quantity = quantityInput.value;
      const discount = discountInput.value;
      const price = priceInput.value;

      if (product && quantity && discount && price) {
        productDetails.value = "";
        quantityInput.value = "";
        discountInput.value = "";
        priceInput.value = "";
        addItemToCart(product, productIdValue, quantity, discount, price);
      }
    });
  }
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      cartItems.innerHTML = "";
      cartItems.appendChild(emptyCart);
      updateCartSummary();
    });
  }

  if (holdBtn) {
    holdBtn.addEventListener("click", () => {
      
      console.log("holded");
    });
  }
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      const headers = [
        "Name",
        "Phone",
        "Phone",
        "Name",
        "Phone",
        "Phone",
        "Name",
        "Phone",
        "Phone",
        "Phone",
        "Phone",
        "Email",
        "Address",
        "NU",
      ];
      const modalName = "Customer";
      createModal(modalName, headers, null);
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      const product = productDetails.value;
      const quantity = quantityInput.value;
      const discount = discountInput.value;
      const price = priceInput.value;
      if (product && quantity && discount && price) {
        addItemBtn.click();
      }
    }

    if (event.key === "Escape") {
      let modalExist = document.getElementById("modal");
      if (modalExist) {
        modalExist.remove();
      } else {
        clearCartBtn.click();
      }
    }
    if (event.ctrlKey && event.key === "h") {
      event.preventDefault();
      console.log("Holded");
    }
    if (event.ctrlKey && event.key === "p") {
      event.preventDefault();
      printBtn.click();
    }
  });
}


const addBtn = document.getElementById("add-btn");
const searchInput = document.getElementById("search");
const tbodySelector = document.querySelector("#dataTable tbody");

function renderTableRows(filteredData) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  filteredData.forEach((rowData, index) => {
    const row = document.createElement("tr");
    row.setAttribute("data-index", index);
    headers.forEach((header) => {
      const td = document.createElement("td");
      td.textContent = rowData[header] || "";
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  document.getElementById("total-rows").textContent = filteredData.length;
}
function initializeTable(data) {
  if (data.length > 0) {
    headers = Object.keys(data[0]);
    const table = document.getElementById("dataTable");
    const thead = table.querySelector("thead");
    const headerRow = document.createElement("tr");

    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      th.addEventListener("click", () => sortTable(header));
      headerRow.appendChild(th);
    });

    thead.innerHTML = ""; 
    thead.appendChild(headerRow);
    renderTableRows(data);
  }
}
function sortTable(column) {
  const columnIndex = headers.indexOf(column);
  const sortedData = [...data];
  let direction = "asc";

  if (document.querySelector(".sort-asc")) {
    document.querySelector(".sort-asc").classList.remove("sort-asc");
  }
  if (document.querySelector(".sort-desc")) {
    document.querySelector(".sort-desc").classList.remove("sort-desc");
  }

  if (
    document
      .querySelector(`th:nth-child(${columnIndex + 1})`)
      .classList.contains("sort-asc")
  ) {
    direction = "desc";
  }

  sortedData.sort((a, b) => {
    if (a[column] === b[column]) return 0;
    if (a[column] == null) return direction === "asc" ? -1 : 1;
    if (b[column] == null) return direction === "asc" ? 1 : -1;
    if (typeof a[column] === "string") {
      return direction === "asc"
        ? a[column].localeCompare(b[column])
        : b[column].localeCompare(a[column]);
    }
    return direction === "asc" ? a[column] - b[column] : b[column] - a[column];
  });

  document
    .querySelector(`th:nth-child(${columnIndex + 1})`)
    .classList.add(direction === "asc" ? "sort-asc" : "sort-desc");
  renderTableRows(sortedData);
}
function filterData() {
  const searchValue = searchInput.value.toLowerCase();

  const filteredData = data.filter((row) => {
    return Object.values(row).some((value) => {
      if (value !== undefined && value !== null) {
        return value.toString().toLowerCase().includes(searchValue);
      }
      return false;
    });
  });

  renderTableRows(filteredData);
}
if (searchInput) {
  searchInput.addEventListener("input", () => {
    filterData();
  });
}
if (addBtn) {
  addBtn.addEventListener("click", () => {
    currentRowIndex = null;

    createModal("Add Record", headers, null);
  });
}
if (tbodySelector) {
  tbodySelector.addEventListener("dblclick", (e) => {
    if (e.target && e.target.nodeName === "TD") {
      currentRowIndex = e.target.parentElement.getAttribute("data-index");
      const rowData = data[currentRowIndex];
      createModal("Edit Record", headers, rowData);
    }
  });
}
function handleClick(event) {
  
  if (event.target.tagName === "LI") {
    
    const ulId = event.target.parentElement.id;
    
    const liIndex = Array.from(event.target.parentElement.children).indexOf(
      event.target
    )+1;
    let data = [];
    if (ulId && liIndex) {
      data = {
        tableName: ulId,
        index: liIndex,
      };
      localStorage.setItem("tableData", JSON.stringify(data));
      window.location.href = "table.html";
    }
  }
}


document.addEventListener("click", handleClick);
