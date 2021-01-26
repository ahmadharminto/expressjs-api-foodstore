import express from 'express';
import multer from 'multer';
import * as cartController from './controller.js';

const router = express.Router();

router.get('/cart', cartController.index);
router.put('/cart', multer().none(), cartController.update);
router.delete('/cart', multer().none(), cartController.destroy);

export default router;