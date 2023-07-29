import db from "../database/connection.js";

export async function getGames(req, res){
    let sql = 'SELECT * FROM games';
    let games;
    const {name, offset, limit, order, desc} = req.query;
    const values = [];
    if (name){
        values.push(`%${name}%`);
        sql += ` WHERE name ILIKE $${values.length}`;
    }
    if (limit){
        values.push(limit);
        sql += ` LIMIT $${values.length}`;
    }
    if (offset){
        values.push(offset);
        sql += ` OFFSET $${values.length}`;
    }
    if (order){
        values.push(order);
        sql += ` ORDER BY $${values.length} ${desc ? 'DESC' : ''}`;
    }
    console.log(sql);
    try {
        if (values.length)
            games = await db.query(sql, values);
        else
            games = await db.query(sql);
        res.status(201).send(games.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function postGame(req, res){
    try {
        const {name, image, stockTotal, pricePerDay} = req.body;
        const game = await db.query(
            `SELECT name
            FROM games
            WHERE name=$1;`,
            [name]);
        if (game.rows.length != 0)
            return res.sendStatus(409);
        await db.query(`
        INSERT INTO games (name, image, "stockTotal", "pricePerDay")
        VALUES ($1, $2, $3, $4);`
        , [name, image, stockTotal, pricePerDay]);
        res.sendStatus(201);
    } catch(err){
        res.status(500).send(err.message);
    }
}