import db from "../database/connection.js";

export async function getCustomers(req, res){
    const {cpf, offset, limit, order, desc} = req.query;
    let customers;
    let sql = 'SELECT * FROM customers';
    const values = [];
    if (cpf){
        values.push(`${cpf}%`);
        sql += ` WHERE cpf ILIKE $${values.length}`;
    }
    if (order){
        sql += ` ORDER BY "${order}" ${desc ? 'DESC' : ''}`;
    }
    if (limit){
        values.push(limit);
        sql += ` LIMIT $${values.length}`;
    }
    if (offset){
        values.push(offset);
        sql += ` OFFSET $${values.length}`;
    }
    try {
        console.log(sql);
        if (values.length)
            customers = await db.query(sql, values);
        else
            customers = await db.query(sql);
        if (customers.rows.length)
        {
            customers.rows.forEach(c => {
                const d = new Date(c.birthday);
                c.birthday = `${d.getFullYear()}-${d.getMonth()<9 ? '0' : ''}${d.getMonth()+1}-${d.getDate()<10 ? '0' : ''}${d.getDate()}`});
        }
        res.status(201).send(customers.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomerById(req, res){
    const {id} = req.params;
    try {
        const customer = await db.query(`
            SELECT *
            FROM customers
            WHERE id=$1;
            `, [id]);
        if (customer.rows.length === 0)
            return res.sendStatus(404);
        const d = new Date(customer.rows[0].birthday);
        customer.rows[0].birthday = `${d.getFullYear()}-${d.getMonth()<9 ? '0' : ''}${d.getMonth()+1}-${d.getDate() < 10 ? '0' : ''}${d.getDate()}`;
        res.status(201).send(customer.rows[0]);
    } catch(err) {
        res.status(500).send(err.message);
    }
}

export async function postCustomer(req, res){
    const {name, phone, cpf, birthday} = req.body;
    try {
        const customer = await db.query(`
            SELECT cpf
            FROM customers
            WHERE cpf=$1;
            `, [cpf]);
        if (customer.rows.length != 0)
            return res.sendStatus(409);
        await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4);
            `, [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch(err){
        res.status(500).send(err.message);
    }
}

export async function updateCustomer(req, res){
    const {name, phone, cpf, birthday} = req.body;
    const {id} = req.params;
    try {
        const customer = await db.query(`
            SELECT *
            FROM customers
            WHERE id=$1;
            `, [id]);
        if(customer.rows.length === 0)
            return res.sendStatus(404);
        const customerCpf = await db.query(`
            SELECT id
            FROM customers
            WHERE cpf=$1;
            `, [cpf]);
        if(customerCpf.rows.length != 0 && customerCpf.rows[0].id != id)
            return res.sendStatus(409);
        await db.query(`
            UPDATE customers
            SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5;
            `, [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    } catch(err) {
        res.status(500).send(err.message);
    }
}