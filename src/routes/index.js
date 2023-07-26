import { Router } from "express";
import gameRouter from "./games.js";
import customerRouter from "./customers.js";
import rentalRouter from "./rentals.js";

const router = Router();

router.use(gameRouter);
router.use(customerRouter);
router.use(rentalRouter);

export default router;