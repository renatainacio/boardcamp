import { Router } from "express";
import { getCustomerById, getCustomers, postCustomer, updateCustomer } from "../controllers/customers.js";
import validateSchema from "../middlewares/validateSchema.js";
import { schemaCustomer } from "../schemas/customer.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);

customerRouter.get("/customers/:id", getCustomerById);

customerRouter.post("/customers", validateSchema(schemaCustomer), postCustomer);

customerRouter.put("/customers/:id", validateSchema(schemaCustomer), updateCustomer);

export default customerRouter;