let productList = [],
  data = [],
  transaction = {},
  transactionItems = {};
let productIds = {};
let holdedBills = [];
let handler, headers, transactionId;
var holdFlag, indexOfH_Bill;
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
function add_Item(tableName, columns_values) {
  return new Promise((resolve, reject) => {
    new QWebChannel(qt.webChannelTransport, async function (channel) {
      let handler = channel.objects.handler;

      if (handler && typeof handler.addItem === "function") {
        try {
          console.log(
            "Calling handler.addItem with:",
            tableName,
            columns_values
          );

          const result = await handler.addItem(
            tableName,
            JSON.stringify(columns_values)
          );

          console.log("Result from handler.addItem:", result);

          if (result === "true") {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error("Error during handler.addItem call:", error);
          reject(error);
        }
      } else {
        const errorMsg =
          "Handler or handler.addItem is not defined or not a function.";
        console.error(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  });
}

function update_Item(tableName, where_clause, columns_values) {
  return new Promise((resolve, reject) => {
    new QWebChannel(qt.webChannelTransport, function (channel) {
      let handler = channel.objects.handler;

      if (handler && typeof handler.updateItem === "function") {
        if (
          handler.updateItem(
            tableName,
            JSON.stringify(where_clause),
            JSON.stringify(columns_values)
          )
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        console.error(
          "Handler or handler.updateItem is not defined or not a function."
        );
        resolve(false);
      }
    });
  });
}
function remove_Item(tableName, itemIdentifier) {
  return new Promise((resolve, reject) => {
    new QWebChannel(qt.webChannelTransport, async function (channel) {
      let handler = channel.objects.handler;

      if (handler && typeof handler.removeItem === "function") {
        try {
          console.log(
            "Calling handler.removeItem with:",
            tableName,
            itemIdentifier
          );

          const result = await handler.removeItem(
            tableName,
            JSON.stringify(itemIdentifier)
          );

          console.log("Result from handler.removeItem:", result);

          if (result === "true") {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error("Error during handler.removeItem call:", error);
          reject(error);
        }
      } else {
        const errorMsg =
          "Handler or handler.removeItem is not defined or not a function.";
        console.error(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  });
}

function last_Item(tableName, columnName) {
  return new Promise((resolve, reject) => {
    new QWebChannel(qt.webChannelTransport, async function (channel) {
      let handler = channel.objects.handler;

      if (handler && typeof handler.lastItem === "function") {
        try {
          console.log("Calling handler.lastItem with:", tableName, columnName);

          const result = await handler.lastItem(tableName, columnName);

          if (result) {
            resolve(result);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error("Error during handler.lastItem call:", error);
          reject(error);
        }
      } else {
        const errorMsg =
          "Handler or handler.lastItem is not defined or not a function.";
        console.error(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  });
}
function select_Item(tableName, columns_values, where_clause) {
  return new Promise((resolve, reject) => {
    new QWebChannel(qt.webChannelTransport, function (channel) {
      let handler = channel.objects.handler;

      if (handler && typeof handler.selectItem === "function") {
        if (
          handler.selectItem(
            tableName,
            JSON.stringify(columns_values),
            JSON.stringify(where_clause)
          )
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        console.error(
          "Handler or handler.selectItem is not defined or not a function."
        );
        resolve(false);
      }
    });
  });
}
function find_Bill(tableName, columns_values, where_clause) {
  return new Promise((resolve, reject) => {
    new QWebChannel(qt.webChannelTransport, function (channel) {
      let handler = channel.objects.handler;

      if (handler && typeof handler.findBill === "function") {
        try {
          const result = handler.findBill(
            JSON.stringify(tableName),
            columns_values,
            JSON.stringify(where_clause)
          );

          if (result) {
            console.log("findBill executed successfully.");
            resolve(true);
          } else {
            console.warn("findBill execution returned false.");
            resolve(false);
          }
        } catch (error) {
          console.error("Error executing findBill:", error);
          reject(error);
        }
      } else {
        console.error(
          "Handler or handler.findBill is not defined or not a function."
        );
        resolve(false);
      }
    });
  });
}
function generate_Bill(items, bill_file) {
  return new Promise((resolve, reject) => {
    new QWebChannel(qt.webChannelTransport, async function (channel) {
      let handler = channel.objects.handler;

      if (handler && typeof handler.generateBill === "function") {
        try {
          //console.warn("Calling handler.generateBill with:", items, bill_file);

          const result = await handler.generateBill(
            JSON.stringify(items),
            bill_file
          );

          console.log("Result from handler.generateBill:", result);

          if (result === "true") {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error("Error during handler.generateBill call:", error);
          reject(error);
        }
      } else {
        const errorMsg =
          "Handler or handler.generateBill is not defined or not a function.";
        console.error(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  });
}
function handleDataFromPython(tableData) {
  if (typeof tableData == "string") {
    transactionId = document.getElementById("bill-no");

    if (transactionId) {
      transactionId.value =
        tableData.slice(0, 3) + String(Number(tableData.slice(3)) + 1);
    }
  } else {
    console.log("Data received from Python:", tableData);
    productList = data = tableData;
    async function getLastRow() {
      try {
        await last_Item("Transactions", "TransactionID");
      } catch (error) {
        console.error("Error fetching the last row:", error);
        window.alert("An error occurred while fetching the last row.");
      }
    }
    setTimeout(() => {
      getLastRow();
    }, 300);
    if (searchInput) {
      initializeTable(data);
    }
  }
}

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

const holdedBillsUl = document.getElementById("holdedBills");
let customerExist = null;

function updateClock() {
  const now = new Date();
  const date = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;

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
    totalPriceAmount += item.price * item.quantity - item.discount;
    totalDiscountAmount += item.discount;
    totalTaxesAmount += item.taxes;
    totalAmountValue += item.total;
  });

  totalProducts.textContent = totalProductsCount;
  totalQuantity.textContent = totalQuantityCount;
  totalPrice.textContent = `₹ ${totalPriceAmount.toFixed(2)}`;
  totalDiscount.textContent = `₹ ${totalDiscountAmount.toFixed(2)}`;
  totalTaxes.textContent = `₹ ${totalTaxesAmount.toFixed(2)}`;
  totalAmount.textContent = `₹ ${totalAmountValue.toFixed(2)}`;
  cart.forEach((item, index) => {
    productIds[index] = { ProductID: item.productIdValue };
  });

  transaction["Profit"] = 0;

  transaction["TransactionID"] = transactionId.value;
  transaction["EmployeeID"] = "jkj";
  transaction["ShopID"] = "tuyg";
  transaction["LocationID"] = "loc";

  transaction["Quantity"] = totalQuantityCount;
  transaction["Discount"] = totalDiscountAmount;
  transaction["Tax"] = totalTaxesAmount;
  transaction["TotalPrice"] = totalPriceAmount;
  transaction["NetSales"] = totalAmountValue;
}
function sellingPriceList(data) {
  cart.forEach((item, index) => {
    transaction["Profit"] += item.total - data[index] * item.quantity;
  });
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

  let existingItem = cart.find(
    (cartItem) => cartItem.productIdValue === productIdValue
  );

  // Parse and calculate
  let itemQuantity = parseInt(quantity, 10);
  let itemPrice = parseFloat(price);
  let itemDiscount = parseFloat(discount) * itemQuantity;
  let itemTaxes =
    (itemPrice - itemDiscount / itemQuantity) * 0.05 * itemQuantity;
  let itemTotal = itemPrice * itemQuantity - itemDiscount + itemTaxes;

  if (existingItem) {
    // Update existing item
    existingItem.quantity += itemQuantity;
    existingItem.discount += itemDiscount;
    existingItem.taxes += itemTaxes;
    existingItem.total =
      existingItem.price * existingItem.quantity -
      existingItem.discount +
      existingItem.taxes;

    const cartItemElement = cartItems.querySelector(
      `.cart-item:nth-child(${cart.indexOf(existingItem) + 1})`
    );
    cartItemElement.innerHTML = `
        <span>${cart.indexOf(existingItem) + 1}</span>
        <span>${existingItem.productIdValue}</span>
        <span>${existingItem.productName}</span>
        <span>${existingItem.quantity}</span>
        <span>&#8377; ${existingItem.price.toFixed(2)}</span>
        <span>&#8377; ${existingItem.discount.toFixed(2)}</span>
        <span>&#8377; ${(
          existingItem.price * existingItem.quantity -
          existingItem.discount
        ).toFixed(2)}</span>
        <span>&#8377; ${existingItem.taxes.toFixed(2)}</span>
        <span>&#8377; ${existingItem.total.toFixed(2)}</span>
        <span><button class="remove-btn">Remove</button></span>
      `;
    itemQuantity = existingItem.quantity;
    itemDiscount = existingItem.discount;
    itemTaxes = existingItem.taxes;
    itemTotal = existingItem.total;
    cartItemElement
      .querySelector(".remove-btn")
      .addEventListener("click", () => {
        cart = cart.filter(
          (cartItem) => cartItem.productIdValue !== existingItem.productIdValue
        );

        delete transactionItems[productIdValue];

        cartItemElement.remove();
        if (cart.length === 0) {
          cartItems.appendChild(emptyCart);
        }
      });
  } else {
    // Add new item
    const item = {
      productIdValue,
      productName,
      quantity: itemQuantity,
      price: itemPrice,
      discount: itemDiscount,
      taxes: itemTaxes,
      total: itemTotal,
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
        <span>&#8377; ${(item.price * item.quantity - item.discount).toFixed(
          2
        )}</span>
        <span>&#8377; ${item.taxes.toFixed(2)}</span>
        <span>&#8377; ${item.total.toFixed(2)}</span>
        <span><button class="remove-btn">Remove</button></span>
      `;

    cartItems.appendChild(cartItem);

    cartItem.querySelector(".remove-btn").addEventListener("click", () => {
      cart = cart.filter(
        (cartItem) => cartItem.productIdValue !== item.productIdValue
      );

      delete transactionItems[productIdValue];

      cartItem.remove();
      if (cart.length === 0) {
        cartItems.appendChild(emptyCart);
      }
    }); // Update transactionItems for both new and existing items
  }
  transactionItems[productIdValue] = {
    ProductID: productIdValue,
    ProductName: productName,
    Quantity: itemQuantity,
    Price: itemPrice,
    Discount: itemDiscount,
    Taxes: itemTaxes,
    Amount: itemPrice * itemQuantity - itemDiscount,
    Total: itemTotal,
  };

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
    transactionItems = {};
    updateCartSummary();
    if (holdFlag == "Added") {
      removeHoldedBill(indexOfH_Bill);
      holdFlag = "";
    }
  });
}

if (holdBtn) {
  holdBtn.addEventListener("click", () => {
    const userConfirmed = confirm(
      "Are you sure you want to hold the current items?"
    );

    if (userConfirmed) {
      if (productIds[0] !== undefined) {
        holdedBills.push(transactionItems);

        // Store holded bills in localStorage
        localStorage.setItem("holdedBills", JSON.stringify(holdedBills));

        holdedBillsUl.innerHTML = "";

        // Append new <li> elements to the <ul>
        for (let i = 0; i < holdedBills.length; i++) {
          const li = document.createElement("li");
          li.textContent = "Holded Bill " + (i + 1); // Display "Holded Bill 1", "Holded Bill 2", etc.
          holdedBillsUl.appendChild(li);
        }

        // Click the clear cart button
        clearCartBtn.click();

        if (holdFlag === "Added") {
          removeHoldedBill(indexOfH_Bill);
          holdFlag = "";
        }
      } else {
        alert("Your Cart is Empty!!!");
      }
    } else {
      // User clicked "Cancel" or did not confirm, so do nothing
      console.log("Action canceled by the user.");
    }
  });
}
if (printBtn) {
  printBtn.addEventListener("click", () => {
    const headers = {
      FirstName: "text",
      LastName: "text",
      Email: "mail",
      Phone: "number",
      Address: "text",
      City: "text",
      Country: "text",
      PaymentMethod: ["UPI", "Cash", "Card"],
    };
    closeFindBill();
    const modalName = "Customer Details";

    if (productIds[0] !== undefined) {
      select_Item("Products", "CostPrice", productIds);
      createModal(modalName, headers, customerExist, null);
    } else {
      alert("Your Cart is Empty!!!");
    }
  });
}

document.addEventListener("keydown", function (event) {
  const modalExist = document.getElementById("modal");
  const findBillExist = document.getElementById("findBill");

  if (event.key === "Enter") {
    event.preventDefault();

    if (modalExist) {
      document.getElementById("save-btn").click();
    } else if (document.activeElement === findBillExist) {
      document.getElementById("findBillBtn").click();
    } else {
      if (productDetails.value) {
        const product = productDetails.value;
        const quantity = quantityInput.value;
        const discount = discountInput.value;
        const price = priceInput.value;

        if (product && quantity && discount && price) {
          addItemBtn.click();
        }
      }
    }
  }

  if (event.key === "Escape") {
    const findBillExist = document.getElementById("findBillDiv");

    if (modalExist) {
      modalExist.remove();
    } else if (findBillExist) {
      closeFindBill();
    } else {
      clearCartBtn.click();
    }
  }
  if (event.ctrlKey && event.key === "h") {
    event.preventDefault();
    holdBtn.click();
  }
  if (event.ctrlKey && event.key === "p") {
    event.preventDefault();

    printBtn.click();
  }
  if (event.ctrlKey && event.key === "f") {
    event.preventDefault();

    createFindBill();
  }
});

const addBtn = document.getElementById("add-btn");
const editBtn = document.getElementById("edit-btn");
const searchInput = document.getElementById("search");
const tbodySelector = document.querySelector("#dataTable tbody");

const removeRowBtn = document.getElementById("remove-btn");
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
  tbody.scrollTop = tbody.scrollHeight;

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
    let headerValues = {};
    headers.forEach((header) => {
      headerValues[header] = "text";
    });

    createModal("Add Record", headerValues, null, null);
  });
}
if (editBtn) {
  editBtn.addEventListener("click", () => {
    window.alert("Double Click on the Row that you want to edit!");
  });
}
if (removeRowBtn) {
  let Flag = false;

  removeRowBtn.addEventListener("click", async () => {
    const table = document.getElementById("dataTable");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    const cols = thead.querySelector("tr");

    if (Flag) {
      const columnHeaders = Array.from(thead.querySelectorAll("th")).map((th) =>
        th.textContent.trim()
      );

      const selectedRows = [];
      tbody.querySelectorAll("tr").forEach((row) => {
        const checkbox = row.querySelector(
          "td.select-cell input[type='checkbox']"
        );
        if (checkbox && checkbox.checked) {
          const rowData = {};
          row.querySelectorAll("td").forEach((cell, index) => {
            if (columnHeaders[index]) {
              rowData[columnHeaders[index]] = cell.textContent.trim();
            }
          });
          selectedRows.push(rowData);
        }
      });

      if (selectedRows.length > 0) {
        const data = JSON.parse(localStorage.getItem("tableData"));
        if (data && data.tableName) {
          if (
            confirm(
              `All the data or transaction related to this data will be deleted!\bAre you sure you want to delete ${selectedRows.length} row(s)?`
            )
          ) {
            for (const rowData of selectedRows) {
              const columnName = Object.keys(rowData)[1];
              const condition = { [columnName]: rowData[columnName] };
              await remove_Item(data.tableName, condition);
            }

            tbody.querySelectorAll("tr").forEach((row) => {
              const checkbox = row.querySelector(
                "td.select-cell input[type='checkbox']"
              );
              if (checkbox && checkbox.checked) {
                row.remove();
              }
            });

            if (cols.querySelectorAll("th.select-header").length > 0) {
              const selectHeader = cols.querySelector("th.select-header");
              selectHeader.remove();

              tbody.querySelectorAll("tr").forEach((row) => {
                const selectCell = row.querySelector("td.select-cell");
                if (selectCell) selectCell.remove();
              });

              Flag = false;
            }
          }
        }
      } else {
        if (cols.querySelectorAll("th.select-header").length > 0) {
          const selectHeader = cols.querySelector("th.select-header");
          selectHeader.remove();

          tbody.querySelectorAll("tr").forEach((row) => {
            const selectCell = row.querySelector("td.select-cell");
            if (selectCell) selectCell.remove();
          });

          Flag = false;
        }
      }
    } else {
      const th = document.createElement("th");
      th.textContent = "Select";
      th.classList.add("select-header");
      cols.appendChild(th);

      tbody.querySelectorAll("tr").forEach((row) => {
        const td = document.createElement("td");
        td.classList.add("select-cell");
        const box = document.createElement("input");
        box.type = "checkbox";
        td.appendChild(box);
        row.appendChild(td);

        row.addEventListener("click", () => {
          const checkbox = row.querySelector(
            "td.select-cell input[type='checkbox']"
          );
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
          }
        });
      });

      Flag = true;
    }
  });
}

if (tbodySelector) {
  tbodySelector.addEventListener("dblclick", (e) => {
    if (e.target && e.target.nodeName === "TD") {
      const secondColumnValue = e.target.parentElement.children[1].textContent.trim();

      const currentRowIndex = data.findIndex((row) => {
        const rowValue = row[headers[1]]?.toString().trim();

        return rowValue === secondColumnValue;
      });

      if (currentRowIndex !== -1) {
        let headerValues = {};
        headers.forEach((header) => {
          headerValues[header] = "text";
        });

        createModal(
          "Edit Record",
          headerValues,
          data[currentRowIndex],
          currentRowIndex
        );
      } else {
        console.error("Row data not found for the specified value.");
      }
    }
  });
}

document.addEventListener("keydown", function (event) {
  const modalExist = document.getElementById("modal");
  if (event.ctrlKey && event.key == "n") {
    if (!modalExist) {
      event.preventDefault();

      addBtn.click();
    }
  } else if (event.altKey && event.key == "e") {
    event.preventDefault();
    editBtn.click();
  } else if (event.key === "Delete") {
    if (!modalExist) {
      event.preventDefault();

      removeRowBtn.click();
    }
  }
});
function createFindBill() {
  if (!document.getElementById("findBillDiv")) {
    const findBillDiv = document.createElement("div");
    findBillDiv.id = "findBillDiv";

    const findBill = document.createElement("input");
    findBill.name = "findBill";
    findBill.id = "findBill";
    findBill.placeholder = "Find Bill";

    const findBillBtn = document.createElement("button");
    findBillBtn.type = "button";
    findBillBtn.id = "findBillBtn";
    findBillBtn.setAttribute("data-tooltip", "Enter");
    findBillBtn.textContent = "Search";
    findBillBtn.addEventListener("click", () => {
      const billNo = document.getElementById("findBill");

      try {
        const transactions = find_Bill(
          ["Transactions", "TransactionItems", "Customers"],
          "*",
          { TransactionID: billNo.value }
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });
    const closeBtn = document.createElement("span");
    closeBtn.id = "close-btn";
    closeBtn.className = "close-btn";

    closeBtn.innerHTML = "&times";

    closeBtn.addEventListener("click", () => {
      findBillDiv.remove();
      localStorage.clear();
    });

    findBillDiv.appendChild(findBill);
    findBillDiv.appendChild(findBillBtn);
    findBillDiv.appendChild(closeBtn);
    document.body.appendChild(findBillDiv);
    findBill.focus();
  } else {
    document.getElementById("findBill").focus();
  }
}
function closeFindBill() {
  const closeBtn = document.getElementById("close-btn");
  if (closeBtn) {
    closeBtn.click();
  }
}
function removeHoldedBill(index) {
  // Remove the holded bill from the array
  holdedBills.splice(index, 1);
  
  // Update localStorage after removing the bill
  localStorage.setItem("holdedBills", JSON.stringify(holdedBills));

  // Remove the corresponding <li> from the DOM
  holdedBillsUl.children[index].remove();
  
  // If no more holded bills, display "Nothing Here..." message
  if (holdedBillsUl.childElementCount === 0) {
    const li = document.createElement("li");
    li.textContent = "Nothing Here...";
    holdedBillsUl.appendChild(li);
  }
}

function handleClick(event) {
  if (event.target.tagName === "LI") {
    // Retrieve holdedBills from localStorage when needed
    let holdedBills = JSON.parse(localStorage.getItem("holdedBills")) || [];

    // Check if the clicked <li> is inside the #holdedBills element
    if (event.target.parentElement.id === "holdedBills") {
      // Check if there are products in the cart
      if (productIds[0] !== undefined) {
        var confirmation = confirm(
          "Are you sure you want to proceed with this action?"
        );
      }

      // If user confirms, clear the cart and add holded items
      if (confirmation) {
        // Clear the cart
        clearCartBtn.click();

        // Get all <li> elements within the holdedBills list
        const items = Array.from(event.target.parentElement.children);

        // Find the index of the clicked <li> item
        const index = items.indexOf(event.target);

        // Check if the index is valid and retrieve the selected holded bill
        if (index >= 0 && index < holdedBills.length) {
          // Iterate over the holded bill and add the items to the cart
          Object.keys(holdedBills[index]).forEach((key) => {
            const itemDetails = holdedBills[index][key];

            // Add each item to the cart using the addItemToCart function
            addItemToCart(
              `${itemDetails.ProductName},,,`, // Assuming product details format
              itemDetails.ProductID,
              itemDetails.Quantity,
              itemDetails.Discount / itemDetails.Quantity,
              itemDetails.Price
            );
          });

          // Set flags to indicate the hold action was successful
          holdFlag = "Added";
          indexOfH_Bill = index;
        }
      }
    }
    // Else condition to handle the other action with tables and localStorage
    else {
      const ulId = event.target.parentElement.id;

      const liIndex =
        Array.from(event.target.parentElement.children).indexOf(event.target) +
        1;

      if (ulId) {
        let dataExist = JSON.parse(localStorage.getItem("tableData"));

        if (!dataExist || dataExist.tableName !== ulId) {
          let data = {
            tableName: ulId,
            index: liIndex,
          };

          // If the clicked list belongs to 'File', redirect to 'index.html'
          if (ulId === "File") {
            localStorage.setItem("tableData", JSON.stringify(data));
            window.location.href = "index.html";
          } else {
            // Otherwise, store the data and redirect to 'table.html'
            localStorage.setItem("tableData", JSON.stringify(data));
            window.location.href = "table.html";
          }
        } else {
          // If the data matches, do nothing or perform a specific action
          if (liIndex === 2) {
            createFindBill(); // Call createFindBill if the clicked index is 2
          }
          console.log(
            "No changes required. The data already exists and matches."
          );
        }
      }
    }
  }
}

window.onload = function () {
  const listIndex = JSON.parse(localStorage.getItem("tableData"));
  if (listIndex && listIndex.tableName === "File" && listIndex.index === 2) {
    createFindBill();
  }
};

document.addEventListener("click", handleClick);

{
  // Track the currently opened dropdown
  let activeDropdown = null;

  // Add click event to each top-level 'li'
  document.querySelectorAll("nav ul li").forEach((item) => {
    item.addEventListener("click", (event) => {
      // Prevent closing dropdown if clicking within the dropdown
      if (event.target.closest("ul.dropdown")) return;

      // Close the previously opened dropdown if different from the current one
      document.querySelectorAll("nav ul li ul.dropdown").forEach((dropdown) => {
        if (dropdown !== item.querySelector("ul.dropdown")) {
          dropdown.style.display = "none";
        }
      });

      // Toggle the display of the current dropdown
      const dropdown = item.querySelector("ul.dropdown");
      if (dropdown) {
        if (dropdown.style.display === "block") {
          dropdown.style.display = "none";
          activeDropdown = null;
        } else {
          dropdown.style.display = "block";
          activeDropdown = dropdown;
        }
      }
    });
  });

  // Hide all dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest("nav")) {
      document.querySelectorAll("nav ul li ul.dropdown").forEach((dropdown) => {
        //dropdown.style.display = "none";
      });
      activeDropdown = null;
    }
  });

  function createModal(modalName, headers, inputData, currentRowIndex) {
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
    saveBtn.type = "button";
    saveBtn.setAttribute("data-tooltip", "Enter");
    saveBtn.textContent = "Save";

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.id = "cancel-btn";
    closeBtn.type = "button";
    closeBtn.setAttribute("data-tooltip", "Esc");

    closeBtn.textContent = "Close";

    formAction.appendChild(closeBtn);
    formAction.appendChild(saveBtn);

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalForm);
    modalContent.appendChild(formAction);
    modal.appendChild(modalContent);

    Object.keys(headers).forEach((header) => {
      const label = document.createElement("label");
      label.textContent = header;
      let input;

      if (typeof headers[header] === "string") {
        input = document.createElement("input");
        input.type = headers[header];
      } else if (Array.isArray(headers[header])) {
        input = document.createElement("select");
        headers[header].forEach((optionValue) => {
          const option = document.createElement("option");
          option.value = optionValue;
          option.textContent = optionValue;
          input.appendChild(option);
        });
      }

      input.name = header;
      if (inputData) {
        input.value = inputData[header] || "";
      }

      modalForm.appendChild(label);
      modalForm.appendChild(input);
    });

    document.body.appendChild(modal);
    modal.style.display = "flex";
    modal
      .getElementsByClassName("close-btn")[0]
      .addEventListener("click", () => modal.remove());
    closeBtn.addEventListener("click", () => modal.remove());

    saveBtn.addEventListener("click", async () => {
      const formData = new FormData(modalForm);
      const rowData = {};

      formData.forEach((value, key) => {
        rowData[key] = value;
      });

      let resultAction = "in";

      if (modalName === "Customer Details") {
        try {
          transaction["CustomerID"] = rowData["Phone"];

          transaction["PaymentMethod"] = rowData["PaymentMethod"];
          delete rowData["PaymentMethod"];
          rowData["CustomerID"] = rowData["Phone"];
          if (customerExist) {
            await update_Item(
              "Customers",
              { Phone: rowData["Phone"] },
              rowData
            );
            await remove_Item("Transactions", {
              TransactionID: transaction["TransactionID"],
            });
          } else {
            await add_Item("Customers", rowData);
          }
          const now = new Date();
          const timestamp = now.toISOString().slice(0, 19).replace("T", " ");
          transaction["Timestamp"] = rowData["Timestamp"] = timestamp;

          await add_Item("Transactions", transaction);

          let bill = {};

          for (var member in bill) delete bill[member];

          Object.keys(transactionItems).forEach((key) => {
            let item = transactionItems[key];
            bill[item.ProductID] = {
              ProductName: item.ProductName,
              Quantity: item.Quantity,
              Discount: item.Discount,
              Price: item.Price,
              Tax: item.Taxes,
              Total: item.Total,
              Amount: item.Amount,
            };
          });

          for (const transactionItem of Object.values(transactionItems)) {
            transactionItem.TransactionID = transaction.TransactionID;
            delete transactionItem["ProductName"];
            await add_Item("TransactionItems", transactionItem);
          }
          await generate_Bill(bill, "bill.txt");
          if (holdFlag == "Added") {
            removeHoldedBill(indexOfH_Bill);
          }
          resultAction = "Printed";
          holdFlag = "";
          transactionId.value =
            transactionId.value.slice(0, 3) +
            String(Number(transactionId.value.slice(3)) + 1);
        } catch (error) {
          console.error("Error adding data:", error);
          resultAction = "Error";
        }
      } else {
        if (currentRowIndex === null) {
          data.push(rowData);
        } else {
          data[currentRowIndex] = rowData;
        }

        renderTableRows(data);

        const storedData = JSON.parse(localStorage.getItem("tableData"));
        if (inputData) {
          const where_clause = {};
          const col = Object.keys(rowData)[1];

          if (storedData.tableName === "TransactionItems") {
            where_clause.TransactionID = rowData.TransactionID;
            where_clause.ProductID = rowData.ProductID;
          } else {
            where_clause[col] = rowData[col];
          }

          update_Item(storedData.tableName, where_clause, rowData);
          resultAction = "Data Updated";
        } else {
          if (storedData.tableName) {
            add_Item(storedData.tableName, rowData);
            resultAction = "Data Added";
          }
        }
      }

      modal.remove();
      setTimeout(() => {
        window.alert(resultAction);
        if (clearCartBtn) {
          clearCartBtn.click();
        }
        document.getElementById("product-details").focus();
      }, 300);
    });
  }
}

function findBillData(data) {
  if (data && data.length > 0) {
    if (data[0] && data[0].length > 0) {
      transactionId.value = data[0][0][3];
    }

    if (data[1] && data[1].length > 0) {
      data[1].forEach((product, index) => {
        addItemToCart(
          data[3][index][0][0],
          product[3],
          product[4],
          product[6],
          product[5]
        );
      });
    }

    if (data[2] && data[2].length > 0) {
      const headers = [
        "FirstName",
        "LastName",
        "Email",
        "Phone",
        "Address",
        "City",
        "Country",
        "PaymentMethod",
      ];
      customerExist = {};
      headers.forEach((val, index) => {
        customerExist[val] = data[2][0][index + 4];
      });
      customerExist["PaymentMethod"] = "UPI";
    }
  }
}
