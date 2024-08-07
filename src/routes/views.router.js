import { Router } from "express";
import ViewsController from "../controllers/views.controller.js";
import { authorize } from "../middleware/authmiddleware.js";
import generarProductos from "../mocking.js";

const viewsController = new ViewsController();
const router = Router();

router.get("/", viewsController.home);
router.get(
  "/realtimeproducts",
  authorize(["admin", "premium"]),
  viewsController.realtimeproducts
);
router.get("/chat", authorize(["user", "premium"]), viewsController.chat);
router.get(
  "/products",
  authorize(["user", "premium"]),
  viewsController.products
);
router.get("/carts/:cid", viewsController.cart);
router.get("/login", viewsController.login);
router.get("/register", viewsController.register);
router.get("/profile", viewsController.profile);
router.get("/mocking", (req, res) => {
  const productsMocking = [];
  for (let i = 0; i < 100; i++) {
    productsMocking.push(generarProductos());
  }
  res.send(productsMocking);
});

router.get("/reset-password", viewsController.renderGenerarResetPassword);
router.get("/password", viewsController.renderResetPassword);
router.get("/confirmacionEnvio", viewsController.renderConfirmacion);
export default router;
