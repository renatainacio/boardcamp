import db from "../database/connection.js";

export async function getCustomers(req, res){
    try {
        const customers = await db.query(`SELECT * FROM customers;`);
        res.status(201).send(customers.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomerById(req, res){
    const {id} = req.params;
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [id]);
        res.status(201).send(customer.rows[0]);
    } catch(err) {
        res.status(500).send(err.message);
    }
}

export async function postCustomer(req, res){
    res.sendStatus(201);
}

export async function updateCustomer(req, res){
    res.sendStatus(201);
}