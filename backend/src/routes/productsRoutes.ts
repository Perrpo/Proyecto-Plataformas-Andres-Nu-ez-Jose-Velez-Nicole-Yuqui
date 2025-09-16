import { Router } from 'express';
import ProductsController from '../controllers/productsController';

const productsController = new ProductsController();

export const setRoutes = (router: Router) => {
    router.get('/products', productsController.listProducts);
    router.post('/products/donate', productsController.donateProduct);
    router.post('/products/discount', productsController.applyDiscount);
};