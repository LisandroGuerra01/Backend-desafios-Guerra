import { Router } from "express";

import {
    findAllProducts,
    findOneProduct,
    addOneProduct,
    updateOneProduct,
    deleteOneProduct
} from "../controllers/productrs.controller.js";

const router = Router();

router.get("/", findAllProducts);
router.get("/:pid", findOneProduct);
router.post("/", addOneProduct);
router.put("/:pid", updateOneProduct);
router.delete("/:pid", deleteOneProduct);

export default router;