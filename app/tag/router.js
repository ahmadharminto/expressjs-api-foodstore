import express from 'express';
import multer from 'multer';
import * as tagController from './controller.js';

const router = express.Router();

router.get('/tags', tagController.index);
router.post('/tag', multer().none(), tagController.store);
router.put('/tag/:id', multer().none(), tagController.update);
router.delete('/tag/:id', tagController.destroy);

export default router;
