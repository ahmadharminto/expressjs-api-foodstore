import express from 'express';
import multer from 'multer';
import * as addressController from './controller.js';

const router = express.Router();

router.get('/delivery-address', addressController.index);
router.post('/delivery-address', multer().none(), addressController.store);
router.put('/delivery-address/:id', multer().none(), addressController.update);
router.delete('/delivery-address/:id', addressController.destroy);

export default router;
