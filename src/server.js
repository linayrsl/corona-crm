const express = require('express');
const bodyParser = require('body-parser');
const Ajv = require('ajv');
const app = express();
const port = 3001;

const HttpStatus = require('http-status-codes');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const customerValidationSchema = {
    type: 'object',
    properties: {
        fullname: {type: 'string', pattern: '^\\w+\\s\\w+$'},
        email: {type: 'string', pattern: '^[^@]+@[^@]+$'},
        birthdate: {type: 'string', pattern: '^([0-9]{2}/[0-9]{2}/[0-9]{4})$'},
        notes: {type: 'string'}
    },
    required: ['fullname', 'email', 'birthdate']
};

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
const validator = ajv.compile(customerValidationSchema);

let customers = [];

function findCustomerById(array, id) {
    return array.find(customer => {
        return customer.id === parseInt(id);
    });
}

app.get('/customer', (req, res) => {
    res.json(customers);
});

app.put('/customer', (req, res) => {
    const isValid = validator(req.body);
    if (!isValid) {
        res.status(HttpStatus.BAD_REQUEST).json({error: validator.errors});
        return;
    }
    const match = customers.find(customer => {
        return (req.body.fullname === customer.fullname && req.body.email === customer.email);
    });
    if (match) {
        res.status(HttpStatus.CONFLICT).json({error: "Customer already exists"});
        return;
    }
    customers.push({
        id: customers.length + 1,
        fullname: req.body.fullname,
        email: req.body.email,
        birthdate: req.body.birthdate,
        createdOn: new Date(),
        notes: req.body.notes
    });
    res.status(HttpStatus.CREATED).send();
});

app.post('/customer/:id', (req, res) => {
    const foundCustomer = findCustomerById(customers, req.params.id);
    if (!foundCustomer) {
        res.status(HttpStatus.NOT_FOUND).json({error: "Customer not found"});
        return;
    }
    const customerIndex = customers.indexOf(foundCustomer);
    const updatedValues = req.body;
    const updatedCustomer = {
        ...foundCustomer,
        ...updatedValues
    };
    customers.splice(customerIndex, 1, updatedCustomer);
    res.status(HttpStatus.OK).json(updatedCustomer);
});

app.delete('/customer/:id', (req, res) => {
    const foundCustomer = findCustomerById(customers, req.params.id);
    if (!foundCustomer) {
        res.status(HttpStatus.NOT_FOUND).json({error: "Customer not found"});
        return;
    }
    const customerIndex = customers.indexOf(foundCustomer);
    customers.splice(customerIndex, 1);
    res.status(HttpStatus.NO_CONTENT).send();
});


app.listen(port, () => {
    console.log('App is listening on port ' + port);
});
