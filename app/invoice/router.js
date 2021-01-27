import express from 'express';
import * as invoiceController from './controller.js';

const router = express.Router();

router.get('/invoice/:order_id', invoiceController.show);

export default router;