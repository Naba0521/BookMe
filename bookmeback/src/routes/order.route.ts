import { Router } from "express";

import {
  CreateOrderController,
  getOrdersByUCompany,
  getOrdersByEmployee,
  getOrdersByUser,
  deleteOrderController,
} from "../controllers/order";
import { getOrdersAndOrder } from "../controllers/order/getAllOrOneOrder";
import { CreateOrderByCompany } from "../controllers/order/create-order-by-company";
import { updateOrderStatus } from "../controllers/order/patch-order-status";
import { UpdateOrderController } from "../controllers/order/put-order";

const BookingRouter = Router();

BookingRouter.post("/order", CreateOrderController)
  .get("/order", getOrdersAndOrder)
  .get("/order/:id", getOrdersAndOrder)
  .get("/order/company/:id", getOrdersByUCompany)
  .get("/order/user/:id", getOrdersByUser)
  .get("/order/employee/:id", getOrdersByEmployee)
  .put("/order/:id", UpdateOrderController)
  .delete("/order/:id", deleteOrderController)
  .post("/order/company", CreateOrderByCompany)
  .patch("/order/:id/status", updateOrderStatus);

export default BookingRouter;
