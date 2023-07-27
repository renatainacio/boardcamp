import db from "../database/connection.js";

export async function getRentals(req, res){
    try{
        const rentals = await db.query(`
            SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
            FROM rentals
            JOIN customers
            ON customers.id=rentals."customerId"
            JOIN games
            ON games.id=rentals."gameId";`
            );
        if (rentals.rows.length)
        {
            rentals.rows.forEach(c => {
                const d = new Date(c.rentDate);
                c.rentDate = `${d.getFullYear()}-${d.getMonth()<9 ? '0' : ''}${d.getMonth()+1}-${d.getDate()<10 ? '0' : ''}${d.getDate()}`;
                c.game = {
                    id: c.gameId,
                    name: c.gameName
                }
                c.customer = {
                    id: c.customerId,
                    name: c.customerName
                }
                delete c.gameName;
                delete c.customerName;
            });
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
        const customer = await db.query(`
            SELECT id
            FROM customers
            WHERE id=$1
            `, [customerId]);
        if (customer.rows.length === 0)
            return res.sendStatus(400);
        const game = await db.query(`
            SELECT "pricePerDay", "stockTotal"
            FROM games
            WHERE id=$1;
            `, [gameId]);
        if (game.rows.length === 0)
            return res.sendStatus(400);
        const rentals = await db.query(`
            SELECT id
            FROM rentals
            WHERE "gameId"=$1 AND "returnDate" IS NULL
            `, [gameId]);
        if (rentals.rows.length >= game.rows[0].stockTotal)
            return res.sendStatus(400);
        const originalPrice = game.rows[0].pricePerDay * daysRented;
        await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice")
            VALUES ($1, $2, $3, $4, $5);`,
            [customerId, gameId, rentDate, daysRented, originalPrice]);
        res.sendStatus(201);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function finishRental(req, res){
    const {id} = req.params;
    const d = new Date();
    let delayFee = 0;
    const returnDate = `${d.getFullYear()}-${d.getMonth()<9 ? '0' : ''}${d.getMonth()+1}-${d.getDate()<10 ? '0' : ''}${d.getDate()}`;
    try{
        const rental = await db.query(`
            SELECT *
            FROM rentals
            WHERE id=$1
            `, [id]);
        if (rental.rows.length === 0)
            return res.sendStatus(404);
        if (rental.rows[0].returnDate != null)
            return res.sendStatus(400);
        const rentDate = Date(rental.rows[0].rentDate);
        const daysRented = rental.rows[0].daysRented;
        const actualDays = d - rentDate;
        if (actualDays > daysRented)
            delayFee = rental.rows[0].originalPrice / daysRented * actualDays;
        await db.query(`
            UPDATE rentals
            SET returnDate=$1, delayFee=$2
            WHERE id=$3
        `, [returnDate, delayFee, id]);
        res.sendStatus(200);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res){
    const {id} = req.params;
    try{
        const rental = await db.query(`
        SELECT returnDate
        FROM rentals
        WHERE id=$1;
        `, [id]);
        if (rental.rows.length === 0)
            return res.sendStatus(404);
        if (rental.rows[0].returnDate === null)
            return res.sendStatus(400);
        await db.query(`
        DELETE FROM rentals
        WHERE id=$1;
        `, [id]);
        res.sendStatus(200);
    }catch(err){
        res.status(500).send(err.message);
    }
}