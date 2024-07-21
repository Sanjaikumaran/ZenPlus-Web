document.addEventListener('DOMContentLoaded', () => {
    const data = [
        { "S.No": "1", "Customer ID": "CUST9985", "First Name": "First_Name_156", "Last Name": "Last_Name_787", "Email": "email467@example.com", "Phone": "123456789974", "Address": "Address_470", "City": "Chennai","State":"TN", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        { "S.No": "2", "Customer ID": "CUST1640", "First Name": "First_Name_688", "Last Name": "Last_Name_658", "Email": "email267@example.com", "Phone": "123456789160", "Address": "Address_118", "City": "Chennai", "Country": "India" },
        // Add the rest of your data here
    ];

 
    const table = document.getElementById('dataTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const searchInput = document.getElementById('search');
    const addBtn = document.getElementById('add-btn');
    const editBtn = document.getElementById('edit-btn');
    const removeBtn = document.getElementById('remove-btn');
    const modal = document.getElementById('modal');
    const modalForm = document.getElementById('modal-form');
    const saveBtn = document.getElementById('save-btn');
    const closeModal = document.getElementById('close-btn');
    const totalRows = document.getElementById('total-rows');

    let currentRowIndex = null;

    // Dynamically create table headers
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.addEventListener('click', () => sortTable(header));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Function to render table rows
    function renderTableRows(filteredData) {
        tbody.innerHTML = '';
        filteredData.forEach((rowData, index) => {
            const row = document.createElement('tr');
            row.setAttribute('data-index', index);
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = rowData[header];
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        totalRows.textContent = filteredData.length;
    }

    // Initial rendering of table rows
    renderTableRows(data);

    function sortTable(column) {
        const columnIndex = headers.indexOf(column);
        const sortedData = [...data];
        let direction = 'asc';

        if (thead.querySelector('.sort-asc')) {
            thead.querySelector('.sort-asc').classList.remove('sort-asc');
        }
        if (thead.querySelector('.sort-desc')) {
            thead.querySelector('.sort-desc').classList.remove('sort-desc');
        }

        if (thead.querySelector(`th:nth-child(${columnIndex + 1})`).classList.contains('sort-asc')) {
            direction = 'desc';
        }

        sortedData.sort((a, b) => {
            if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        thead.querySelector(`th:nth-child(${columnIndex + 1})`).classList.add(direction === 'asc' ? 'sort-asc' : 'sort-desc');
        renderTableRows(sortedData);
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = data.filter(row => {
            return headers.some(header => {
                // Check if row[header] is defined before calling toLowerCase()
                const value = row[header];
                return value && value.toLowerCase().includes(searchTerm);
            });
        });
        renderTableRows(filteredData);
    });
    // Show modal
    function showModal() {
        modal.style.display = 'flex';
    }

    // Hide modal
    function hideModal() {
        modal.style.display = 'none';
    }

    // Add new row
    addBtn.addEventListener('click', () => {
        currentRowIndex = null;
        modalForm.innerHTML = '';
        headers.forEach(header => {
            const label = document.createElement('label');
            label.textContent = header;
            const input = document.createElement('input');
            input.type = 'text';
            input.name = header;
            modalForm.appendChild(label);
            modalForm.appendChild(input);
        });
        showModal();
    });

    // Edit row
    tbody.addEventListener('click', (e) => {
        if (e.target && e.target.nodeName === 'TD') {
            currentRowIndex = e.target.parentElement.getAttribute('data-index');
            const rowData = data[currentRowIndex];
            modalForm.innerHTML = '';
            headers.forEach(header => {
                const label = document.createElement('label');
                label.textContent = header;
                const input = document.createElement('input');
                input.type = 'text';
                input.name = header;
                input.value = rowData[header];
                modalForm.appendChild(label);
                modalForm.appendChild(input);
            });
            showModal();
        }
    });

    // Save new or edited row
    saveBtn.addEventListener('click', () => {
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

    // Remove row
    removeBtn.addEventListener('click', () => {
        if (currentRowIndex !== null) {
            data.splice(currentRowIndex, 1);
            renderTableRows(data);
            currentRowIndex = null;
        }
    });

    // Close modal
    closeModal.addEventListener('click', hideModal);

    // Hide modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
});