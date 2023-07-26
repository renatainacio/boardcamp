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
    res.sendStatus(201);
}

export async function postCustomer(req, res){
    res.sendStatus(201);
}

export async function updateCustomer(req, res){
    res.sendStatus(201);
}