import Router from "koa-router";
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProducts,
  removeProducts
} from '../handlers/product.js';
import { validateInputProduct } from '../middleware/productMiddleware.js';
import { getAll } from "../database/repositories/product.js";

const router = new Router({
  prefix: "/api"
});

router.get("/test", async (ctx) => {
  const products = getAll();
  await ctx.render("product", {
    products
  });
});

router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.post("/products", validateInputProduct, addProduct);
router.put("/product/:id", validateInputProduct, updateProduct);
router.put("/products", updateProducts);
router.delete("/product/:id", deleteProduct);
router.post("/products/d", removeProducts);

export default router;