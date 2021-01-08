import express from 'express';
import multer from 'multer';
import * as categoryController from './controller.js';

const router = express.Router();

router.get('/categories', categoryController.index);
router.post('/category', multer().none(), categoryController.store);
router.put('/category/:id', multer().none(), categoryController.update);
router.delete('/category/:id', categoryController.destroy);

export default router;
