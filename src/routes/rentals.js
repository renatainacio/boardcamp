import { Router } from "express";
import { deleteRental, finishRental, getRentals, postRental } from "../controllers/rentals.js";

const rentalRouter = Router();

rentalRouter.get("/rentals", getRentals);

rentalRouter.post("/rentals", postRental);

rentalRouter.post("/rentals/:id/return", finishRental);

rentalRouter.delete("/rental/:id", deleteRental);

export default rentalRouter;