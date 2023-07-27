import db from "../database/connection.js";

export async function getRentals(req, res){
    try{
        const rentals = await db.query('SELECT * FROM rentals;');
        if (rentals.rows.length)
        {
            rentals.rows.forEach(c => {
                const d = new Date(c.rentDate);
                c.rentDate = `${d.getFullYear()}-${d.getMonth()<9 ? '0' : ''}${d.getMonth()+1}-${d.getDate()<10 ? '0' : ''}${d.getDate()}`});
        }
        res.send(rentals.rows);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function postRental(req, res){
    const {customerId, gameId, daysRented} = req.body;
    if (daysRented <= 0)
        return res.sendStatus(400);
    const d = new Date();
    const rentDate = `${d.getFullYear()}-${d.getMonth()<9 ? '0' : ''}${d.getMonth()+1}-${d.getDate()<10 ? '0' : ''}${d.getDate()}`;
    try{
        const customer = await db.query(`SELECT id FROM customers WHERE id=$1`, [customerId]);
        if (customer.rows.length === 0)
            return res.sendStatus(400);
        const game = await db.query(`SELECT "pricePerDay", "stockTotal" FROM games WHERE id=$1;`, [gameId]);
        if (game.rows.length === 0)
            return res.sendStatus(400);
        const rentals = await db.query(`SELECT id FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`, [gameId]);
        if (rentals.rows.length >= game.rows[0].stockTotal)
            return res.sendStatus(400);
        const originalPrice = game.rows[0].pricePerDay * daysRented;
        await db.query(
            'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ($1, $2, $3, $4, $5);',
            [customerId, gameId, rentDate, daysRented, originalPrice]);
        res.sendStatus(201);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function finishRental(req, res){
    res.sendStatus(200);
}

export async function deleteRental(req, res){
    res.sendStatus(200);
}