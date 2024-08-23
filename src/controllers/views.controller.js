import ProductController from "../controllers/product.controller.js";
import { productsModel } from "../models/products.model.js";
import { cartModel } from "../models/cart.model.js";
import UserController from "../controllers/user.controller.js";

const productController = new ProductController();
const userController = new UserController();

class ViewsController {
  constructor() {}

  async home(req, res) {
    try {
      if (!req.session.login) {
        return res.redirect("/login");
      }
      const user = req.session.user.first_name;
      const listadeproductos = await productController.getProductsView();
      res.render("home", { listadeproductos, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  async adminUsers(req, res) {
    try {
      if (!req.session.login) {
        return res.redirect("/login");
      }
      const users = await userController.getUsers();
      res.render("adminUsers", { users });
    } catch (error) {
      console.error("Error en adminUsers: ", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  realtimeproducts(req, res) {
    try {
      if (!req.session.login) {
        return res.redirect("/login");
      }
      res.render("realtimeproducts");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  chat(req, res) {
    try {
      if (!req.session.login) {
        return res.redirect("/login");
      }
      res.render("chat");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async products(req, res) {
    try {
      if (!req.session.login) {
        return res.redirect("/login");
      }

      const cartId = req.user.cart.toString();
      console.log(cartId);

      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      const options = {
        page: page,
        limit: limit,
        lean: true,
        leanWithId: false,
      };

      const result = await productsModel.paginate({}, options);

      res.render("products", {
        user: req.session.user.first_name,
        products: result.docs,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        limit: result.limit,
        cartId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async cart(req, res) {
    try {
      if (!req.session.login) {
        return res.redirect("/login");
      }
      const cartId = req.params.cid;
      const cart = await cartModel
        .findById(cartId)
        .populate("products.product");
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      const productsWithSubtotals = cart.products.map((item) => {
        if (item.product) {
          return {
            ...item.toObject(),
            subtotal: item.quantity * item.product.price,
          };
        } else {
          return {
            ...item.toObject(),
            subtotal: 0,
            product: {
              title: "Producto no encontrado",
              price: 0,
            },
          };
        }
      });
      res.render("carts", { products: productsWithSubtotals, cartId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  login(req, res) {
    res.render("login");
  }

  register(req, res) {
    res.render("register");
  }

  profile(req, res) {
    try {
      if (!req.session.login) {
        return res.redirect("/login");
      }
      res.render("profile");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderGenerarResetPassword(req, res) {
    res.render("generarResetPassword");
  }

  async renderResetPassword(req, res) {
    res.render("resetPassword");
  }

  async renderConfirmacion(req, res) {
    res.render("confirmacionEnvio");
  }
}

export default ViewsController;
