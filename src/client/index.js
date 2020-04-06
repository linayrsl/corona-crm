const customerForm = document.getElementById('customer-form');
const table = document.getElementById('customer-table');
const API_URL = "http://localhost:3001";


function collectFormData(customerForm) {
    return {
        fullname: customerForm['user-name'].value,
        email: customerForm['user-email'].value,
        birthdate: customerForm['user-birthdate'].value,
        notes: customerForm['user-notes'].value
    };
}

function formatDate(date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}

function clearTable() {
    const currentNumOfTableRows = table.querySelectorAll('tr').length;
    for (let i = currentNumOfTableRows - 1; i >= 1; i--) {
        table.deleteRow(i);
    }
}

function refreshTable() {
    clearTable();
    getAllCustomers()
        .then((customers) => {
            for (let customer of customers) {
                addCustomerToTable(customer);
            }
        })
}

function createCustomer(customerData) {
    return fetch(API_URL + '/customer', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(customerData),
    })
    .catch((error) => {
        console.log(error);
        return Promise.reject(error);
    });
}

function getAllCustomers() {
    return fetch(API_URL + '/customer', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
        .then((response) => response.json())
        .then((customers) => customers.map((customer) => {
            customer.createdOn = new Date(customer.createdOn);
            return customer;
        }))
        .catch((error) => {
            console.log(error);
        });
}


function addCustomerToTable(customerData) {
    const customerTableMapping = {
        id: 0,
        fullname: 1,
        email: 2,
        birthdate: 3,
        createdOn: 4,
        notes: -1
    };
    const row = table.insertRow(-1);
    for (const key in customerData) {
        if (customerData.hasOwnProperty(key)) {
            const cellIndex = customerTableMapping[key];
            if (cellIndex >= 0) {
                const cell = row.insertCell(cellIndex);
                cell.innerHTML = key === 'createdOn' ? formatDate(customerData[key]) : customerData[key];
            }
        }
    }
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const editImage = document.createElement('img');
        editImage.setAttribute('src', 'images/edit-alt-regular-24.png');
    const deleteImage = document.createElement('img');
        deleteImage.setAttribute('src', 'images/bx-trash.svg');
    editButton.append(editImage);
    deleteButton.append(deleteImage);
    const cell = row.insertCell();
    cell.append(editButton, deleteButton);
}

customerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const customerData = collectFormData(customerForm);
    if (!validateOver18() || !fullnameValidator() || !emailValidator()|| !birthdateValidator()) {
        return;
    }
    createCustomer(customerData)
        .then(() => {
            refreshTable();
        })
});

const email = document.getElementById('user-email');
const emailFeedbackMessage = document.querySelector('.email .invalid-feedback');
const emailValidator = () => {
    const value = email.value;
    const emailRegex = /^[^@]+@[^@]+$/;
    if (emailRegex.test(value)) {
        email.classList.remove('is-invalid');
        emailFeedbackMessage.style.display = 'none';
        return true;
    }
    email.classList.add('is-invalid');
    emailFeedbackMessage.style.display = 'block';
    return false;
};
email.addEventListener('keydown', emailValidator);
email.addEventListener('blur', emailValidator);
email.addEventListener('focus', emailValidator);


const fullname = document.getElementById('user-name');
const fullnameFeedbackMessage = document.querySelector('.full-name .invalid-feedback');
const fullnameValidator = () => {
    const value = fullname.value;
    if (value.split(' ').length > 1) {
        fullname.classList.remove('is-invalid');
        fullnameFeedbackMessage.style.display = 'none';
        return true;
    }
    fullname.classList.add('is-invalid');
    fullnameFeedbackMessage.style.display = 'block';
    return false;
};
fullname.addEventListener('keydown', fullnameValidator);
fullname.addEventListener('blur', fullnameValidator);
fullname.addEventListener('focus', fullnameValidator);


const birthdate = document.getElementById('user-birthdate');
const birthdateFeedbackMessage = document.querySelector('.birthdate .invalid-feedback');
const birthdateValidator = () => {
    const value = birthdate.value;
    const emailRegex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    if (emailRegex.test(value)) {
        birthdate.classList.remove('is-invalid');
        birthdateFeedbackMessage.style.display = 'none';
        return true;
    }
    birthdate.classList.add('is-invalid');
    birthdateFeedbackMessage.style.display = 'block';
    return false;
};
birthdate.addEventListener('keydown', birthdateValidator);
birthdate.addEventListener('blur', birthdateValidator);
birthdate.addEventListener('focus', birthdateValidator);


const checkbox = document.getElementById('user-checkbox');
const checkboxFeedbackMessage = document.querySelector('.age-verification .invalid-feedback');
function validateOver18() {
    if (checkbox.checked === false) {
        checkbox.classList.add('is-invalid');
        checkboxFeedbackMessage.style.display = 'block';
        return false;
    }
    checkbox.classList.remove('is-invalid');
    checkboxFeedbackMessage.style.display = 'none';
    return true;
}
checkbox.addEventListener('change', validateOver18);

refreshTable();

