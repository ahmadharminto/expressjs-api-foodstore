import express from 'express';
import multer from 'multer';
import * as orderController from './controller.js';

const router = express.Router();

router.get('/order', orderController.index);
router.post('/order', multer().none(), orderController.store);

export default router;