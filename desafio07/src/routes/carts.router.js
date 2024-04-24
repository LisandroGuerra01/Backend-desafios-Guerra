import { Router } from 'express';

import {
    findOneCart,
    createCart,
    addOneProductToCart,
    deleteOneProductFromCart,
    deleteAllProductsFromCart,
    updateAllProductsFromCart,
    updateProductQuantityFromCart
} from '../controllers/carts.controller.js';

const router = Router();

router.get('/:cid', findOneCart);
router.post('/', createCart);
router.post('/:cid/product/:pid', addOneProductToCart);
router.delete('/:cid/product/:pid', deleteOneProductFromCart);
router.delete('/:cid', deleteAllProductsFromCart);
router.put('/:cid', updateAllProductsFromCart);
router.put('/:cid/product/:pid', updateProductQuantityFromCart);

export default router;