let productList = [],
  data = [],
  transaction = {},
  transactionItems = {};
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

          // Pass the tableName and itemIdentifier to the handler
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

    let resultAction = "in";
    saveBtn.addEventListener("click", () => {
      const formData = new FormData(modalForm);
      const rowData = {};
      formData.forEach((value, key) => {
        rowData[key] = value;
      });
      if (modalName == "Customer Details") {
        async function addData() {
          try {
            await add_Item("Customers", rowData);

            await add_Item("Transactions", transaction);

            const transactionItemsArray = Object.values(transactionItems);

            for (const transactionItem of transactionItemsArray) {
              transactionItem.TransactionID = transaction.TransactionID;
              await add_Item("TransactionItems", transactionItem);
            }

            resultAction = "Printed";
          } catch (error) {
            console.error("Error adding data:", error);
            resultAction = "Error";
          }
        }

        addData();
      } else {
        if (currentRowIndex === null) {
          data.push(rowData);
        } else {
          data[currentRowIndex] = rowData;
        }
        renderTableRows(data);
        let storedData = JSON.parse(localStorage.getItem("tableData"));
        if (inputData) {
          let where_clause = {};
          let col = Object.keys(rowData)[1];

          if (storedData.tableName == "TransactionItems") {
            where_clause.TransactionID = rowData.TransactionID;
            where_clause.ProductID = rowData.ProductID;
          } else {
            where_clause[col] = rowData[col];
          }

          update_Item(storedData.tableName, where_clause, rowData);
          resultAction = "Data Updated";
        } else {
          if (storedData.tableData) {
            add_Item(storedData.tableName, rowData);
            resultAction = "Data Added";
          }
        }
      }

      modal.remove();
      setTimeout(() => {
        window.alert(resultAction);
      }, 300);
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

    transaction["SNo"] = "1";
    transaction["TransactionID"] = "trt788";
    transaction["CustomerID"] = "csuhsun";
    transaction["EmployeeID"] = "jkj";
    transaction["Timestamp"] = "89uj";
    transaction["ShopID"] = "tuyg";

    transaction["Profit"] = "7897";
    transaction["PaymentMethod"] = "upi";
    transaction["LocationID"] = "loc";

    transaction["Quantity"] = totalQuantityCount;
    transaction["Discount"] = totalDiscountAmount;
    transaction["Tax"] = totalTaxesAmount;
    transaction["TotalPrice"] = totalPriceAmount;
    transaction["NetSales"] = totalAmountValue;
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

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
      existingItem.discount += parseFloat(discount) * quantity;
      existingItem.taxes += (price - discount) * 0.05 * quantity;
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
        <span>&#8377; ${(existingItem.price * existingItem.quantity).toFixed(
          2
        )}</span>
        <span>&#8377; ${existingItem.taxes.toFixed(2)}</span>
        <span>&#8377; ${existingItem.total.toFixed(2)}</span>
        <span><button class="remove-btn">Remove</button></span>
      `;

      cartItemElement
        .querySelector(".remove-btn")
        .addEventListener("click", () => {
          cart = cart.filter(
            (cartItem) =>
              cartItem.productIdValue !== existingItem.productIdValue
          );
          window.alert(cart);

          delete transactionItems[productIdValue];

          cartItemElement.remove();
          if (cart.length == 0) {
            cartItems.appendChild(emptyCart);
          }

          updateCartSummary();
        });
    } else {
      const taxes = (price - discount) * 0.05 * quantity;
      const total = price * quantity - discount * quantity + taxes;
      discount = discount * quantity;

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

      cartItem.querySelector(".remove-btn").addEventListener("click", () => {
        cart = cart.filter(
          (cartItem) => cartItem.productIdValue !== item.productIdValue
        );

        delete transactionItems[productIdValue];

        cartItem.remove();
        if (cart.length == 0) {
          cartItems.appendChild(emptyCart);
        }

        updateCartSummary();
      });
    }

    transactionItems[productIdValue] = {
      ProductID: productIdValue,
      Quantity: parseInt(quantity),
      Price: parseFloat(price),
      Discount: parseFloat(discount),
      Amount: price * quantity,
      Taxes: parseFloat((price - discount) * 0.05 * quantity),
      Total:
        price * quantity -
        discount * quantity +
        (price - discount) * 0.05 * quantity,
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
        "SNo",
        "CustomerID",
        "Timestamp",
        "ShopID",
        "FirstName",
        "LastName",
        "Email",
        "Phone",
        "Address",
        "City",
        "Country",
      ];
      const modalName = "Customer Details";
      createModal(modalName, headers, null);
    });
  }
  document.querySelectorAll(".main").forEach((element) => {
    element.addEventListener("click", () => {
      localStorage.clear();
    });
  });

  document.addEventListener("keydown", function (event) {
    let modalExist = document.getElementById("modal");

    if (event.key === "Enter") {
      event.preventDefault();
      if (modalExist) {
        document.getElementById("save-btn").click();
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
{
  const removeRowBtn = document.getElementById("remove-btn");
  function renderTableRows(filteredData) {
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";
    filteredData.forEach((rowData, index) => {
      const row = document.createElement("tr");
      //row.setAttribute("data-tooltip", "Double click to edit");

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
      return direction === "asc"
        ? a[column] - b[column]
        : b[column] - a[column];
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
  if (removeRowBtn) {
    let Flag = false; // Toggle this as needed

    removeRowBtn.addEventListener("click", async () => {
      const table = document.getElementById("dataTable");
      const thead = table.querySelector("thead");
      const tbody = table.querySelector("tbody");
      const cols = thead.querySelector("tr");

      if (Flag) {
        // Collect column headers
        const columnHeaders = Array.from(
          thead.querySelectorAll("th")
        ).map((th) => th.textContent.trim());

        // Check if any checkboxes are checked
        const selectedRows = [];
        tbody.querySelectorAll("tr").forEach((row) => {
          const checkbox = row.querySelector(
            "td.select-cell input[type='checkbox']"
          );
          if (checkbox && checkbox.checked) {
            // Collect cell values and create an object
            const rowData = {};
            row.querySelectorAll("td").forEach((cell, index) => {
              if (columnHeaders[index]) {
                rowData[columnHeaders[index]] = cell.textContent.trim();
              }
            });
            selectedRows.push(rowData);
          }
        });

        // Show selected rows as JSON and confirm deletion
        if (selectedRows.length > 0) {
          const data = JSON.parse(localStorage.getItem("tableData"));
          if (data && data.tableName) {
            if (
              confirm(
                `Are you sure you want to delete ${selectedRows.length} row(s)?`
              )
            ) {
              // Use await to handle async operation
              for (const rowData of selectedRows) {
                // Assume we're removing based on the first column
                const columnName = Object.keys(rowData)[1];
                const condition = { [columnName]: rowData[columnName] };
                await remove_Item(data.tableName, condition);
              }

              // Remove rows from the frontend
              tbody.querySelectorAll("tr").forEach((row) => {
                const checkbox = row.querySelector(
                  "td.select-cell input[type='checkbox']"
                );
                if (checkbox && checkbox.checked) {
                  row.remove(); // Remove the row from the table
                }
              });

              // Remove the "Select" header and checkboxes from rows
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
          // Remove the "Select" header and checkboxes from rows
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
        // Add the "Select" header and checkboxes to each row
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

          // Add click event listener to toggle checkbox
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
        currentRowIndex = e.target.parentElement.getAttribute("data-index");
        const rowData = data[currentRowIndex];
        createModal("Edit Record", headers, rowData);
      }
    });
  }
  function handleClick(event) {
    if (event.target.tagName === "LI") {
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
          localStorage.setItem("tableData", JSON.stringify(data));
          window.location.href = "table.html";
        } else {
          console.log(
            "No changes required. The data already exists and matches."
          );
        }
      }
    }
  }

  document.addEventListener("click", handleClick);
}
