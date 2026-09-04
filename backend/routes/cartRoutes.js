import express from "express";

import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
} from "../controllers/cartController.js";

import {
  protect,
} from "../middlewares/authMiddleware.js";

const cartRoutes = express.Router();

/* Add item */
cartRoutes.post(
  "/add",
  protect,
  addToCart
);

/* Get cart */
cartRoutes.get(
  "/get",
  protect,
  getCart
);

/* Update quantity */
cartRoutes.put(
  "/update/:menuId",
  protect,
  updateCartQuantity
);

/* Remove item */
cartRoutes.delete(
  "/remove/:menuId",
  protect,
  removeFromCart
);

export default cartRoutes;