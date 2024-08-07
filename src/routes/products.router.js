import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import { authorize } from "../middleware/authmiddleware.js";

const productController = new ProductController();
const router = Router();

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", authorize("admin"), productController.addProduct);
router.put("/:pid", authorize("admin"), productController.updateProduct);
router.delete("/:pid", authorize("admin"), productController.deleteProduct);

export default router;
