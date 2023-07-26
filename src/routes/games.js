import { Router } from "express";
import { getGames, postGame } from "../controllers/games.js";

const gameRouter = Router();

gameRouter.get("/games", getGames);

gameRouter.post("/games", postGame);

export default gameRouter;