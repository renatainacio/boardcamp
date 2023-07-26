import { Router } from "express";
import { getCustomerById, getCustomers, postCustomer, updateCustomer } from "../controllers/customers.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);

customerRouter.get("/customers:id", getCustomerById);

customerRouter.post("/customers", postCustomer);

customerRouter.put("/customers/:id", updateCustomer);

export default customerRouter;