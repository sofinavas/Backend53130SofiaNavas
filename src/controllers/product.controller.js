import { productsModel } from "../models/products.model.js";

export default class ProductController {
  getProducts = async (queryParams) => {
    try {
      const { limit = 10, page = 1, sort, query } = queryParams;
      const skip = (page - 1) * limit;

      let filter = {};
      if (query && typeof query === "string") {
        filter = {
          ...filter,
          $or: [{ category: query }, { availability: query }],
        };
      }

      let sortOption = {};
      if (sort === "asc") {
        sortOption = { price: 1 };
      } else if (sort === "desc") {
        sortOption = { price: -1 };
      }

      const products = await productsModel
        .find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);
      const totalProducts = await productsModel.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;

      return {
        status: "success",
        payload: products,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?page=${prevPage}&limit=${limit}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?page=${nextPage}&limit=${limit}`
          : null,
      };
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw new Error("Error al obtener productos.");
    }
  };

  getProductsView = async () => {
    try {
      return await productsModel.find().lean();
    } catch (error) {
      console.error("Error al obtener productos en formato lean:", error);
      throw new Error("Error al obtener productos en formato lean.");
    }
  };

  getProductById = async (id) => {
    try {
      const producto = await productsModel.findById(id);
      if (!producto) {
        console.error(`Producto con ID ${id} no encontrado`);
        return null;
      }
      return producto;
    } catch (error) {
      console.error(`Error al encontrar producto por ID ${id}:`, error);
      throw new Error(`Error al encontrar producto con ID ${id}.`);
    }
  };

  async addProduct(product) {
    try {
      const newProduct = await productsModel.create(product);
      console.log("Producto creado:", newProduct);
      return newProduct;
    } catch (error) {
      console.error("Error al crear un producto:", error);
      throw new Error("Error al crear un producto.");
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      console.log("Intentando actualizar producto con ID:", id);
      console.log("Datos del producto actualizado:", productoActualizado);
      const updateProduct = await productsModel.findByIdAndUpdate(
        id,
        productoActualizado,
        { new: true } // Devuelve el producto actualizado
      );
      if (!updateProduct) {
        console.error(`Producto con ID ${id} no encontrado`);
        return null;
      }
      console.log("Producto actualizado:", updateProduct);
      return updateProduct;
    } catch (error) {
      console.error(`Error al actualizar producto con ID ${id}:`, error);
      throw new Error(`Error al actualizar producto con ID ${id}.`);
    }
  }

  async deleteProduct(id) {
    try {
      console.log("Intentando eliminar producto con ID:", id);
      const deleteProduct = await productsModel.findByIdAndDelete(id);
      if (!deleteProduct) {
        console.error(`Producto con ID ${id} no encontrado`);
        return null;
      }
      console.log(`Producto con ID ${id} eliminado`);
      return deleteProduct;
    } catch (error) {
      console.error(`Error al eliminar producto con ID ${id}:`, error);
      throw new Error(`Error al eliminar producto con ID ${id}.`);
    }
  }
}
