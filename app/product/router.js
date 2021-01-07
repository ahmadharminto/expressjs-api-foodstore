import express from 'express';
import multer from 'multer';
import os from 'os';
import * as productController from './controller.js';

const router = express.Router();

router.get('/products', productController.index);
router.post('/product', multer({ dest: os.tmpdir() }).single('image'), productController.store);
router.put('/product/:id', multer({ dest: os.tmpdir() }).single('image'), productController.update);
router.delete('/product/:id', productController.destroy);

export default router;
