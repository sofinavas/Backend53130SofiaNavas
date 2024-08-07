import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import errorHandler from "../services/errors/info.js";

const cartController = new CartController();
const router = Router();

router.post("/", cartController.createCart);
router.get("/:cid", cartController.getCartById);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete("/:cid/products/:pid", cartController.deleteProductFromCart);
router.put("/:cid", cartController.updateCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantity);
router.delete("/:cid", cartController.deleteAllProductsFromCart);
router.post("/:cid/purchase", cartController.purchaseCart, errorHandler);

export default router;
