import db from "../database/connection.js";

export async function getGames(req, res){
    try {
        const games = await db.query(`SELECT * FROM games;`);
        res.status(201).send(games.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function postGame(req, res){
    try {
        const {name, image, stockTotal, pricePerDay} = req.body;
        const game = await db.query(`SELECT name FROM games WHERE name='${name}';`);
        if (game.rows.length != 0)
            return res.sendStatus(409);
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay]);
        res.sendStatus(201);
    } catch(err){
        res.status(500).send(err.message);
    }
}