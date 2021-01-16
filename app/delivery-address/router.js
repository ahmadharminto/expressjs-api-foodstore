import express from 'express';
import * as addressController from './controller.js';

const router = express.Router();

router.get('/delivery-address', addressController.index);
router.post('/delivery-address', addressController.store);
router.put('/delivery-address/:id', addressController.update);
router.delete('/delivery-address/:id', addressController.destroy);

export default router;
