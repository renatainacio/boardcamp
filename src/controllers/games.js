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
    res.sendStatus(201);
}