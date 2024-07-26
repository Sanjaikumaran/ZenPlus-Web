let data = [];
let headers = [];
let currentRowIndex = null;

function handleDataFromPython(data1) {
  console.log("Data received from Python:", data1);
  data = data1;
  if (data.length > 0) {
    //window.alert(JSON.stringify(data[0])); // Display first item
    initializeTable(); // Initialize the table with the new data
  } else {
    window.alert("No data available");
  }
}

// Function to initialize the table
function initializeTable() {
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
    
    thead.innerHTML = ""; // Clear existing headers
    thead.appendChild(headerRow);
    renderTableRows(data);
  }
}

// Function to render table rows
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

// Function to sort table
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

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const addBtn = document.getElementById("add-btn");
  const removeBtn = document.getElementById("remove-btn");
  const modal = document.getElementById("modal");
  const modalForm = document.getElementById("modal-form");
  const saveBtn = document.getElementById("save-btn");
  const closeModal = document.getElementById("close-btn");

  function showModal() {
    modal.style.display = "flex";
  }

  function hideModal() {
    modal.style.display = "none";
  }

  addBtn.addEventListener("click", () => {
    currentRowIndex = null;
    modalForm.innerHTML = "";
    headers.forEach((header) => {
      const label = document.createElement("label");
      label.textContent = header;
      const input = document.createElement("input");
      input.type = "text";
      input.name = header;
      modalForm.appendChild(label);
      modalForm.appendChild(input);
    });
    showModal();
  });

  document.querySelector("#dataTable tbody").addEventListener("click", (e) => {
    if (e.target && e.target.nodeName === "TD") {
      currentRowIndex = e.target.parentElement.getAttribute("data-index");
      const rowData = data[currentRowIndex];
      modalForm.innerHTML = "";
      headers.forEach((header) => {
        const label = document.createElement("label");
        label.textContent = header;
        const input = document.createElement("input");
        input.type = "text";
        input.name = header;
        input.value = rowData[header];
        modalForm.appendChild(label);
        modalForm.appendChild(input);
      });
      showModal();
    }
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
    hideModal();
  });

  removeBtn.addEventListener("click", () => {
    if (currentRowIndex !== null) {
      data.splice(currentRowIndex, 1);
      renderTableRows(data);
      currentRowIndex = null;
    }
  });

  closeModal.addEventListener("click", hideModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });
});

// Initialize WebChannel and event listeners
window.onload = function () {
  new QWebChannel(qt.webChannelTransport, function (channel) {
    window.handler = channel.objects.handler;
    // Example of calling handleDataFromPython with some mock data
    // handler.someMethod().then(handleDataFromPython);
  });
};
