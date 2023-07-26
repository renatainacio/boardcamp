import { Router } from "express";
import { getGames, postGame } from "../controllers/games.js";
import validateSchema from "../middlewares/validateSchema.js";
import { schemaGame } from "../schemas/game.js";

const gameRouter = Router();

gameRouter.get("/games", getGames);

gameRouter.post("/games", validateSchema(schemaGame), postGame);

export default gameRouter;