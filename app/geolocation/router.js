import express from 'express';
import * as locationController from './controller.js';

const router = express.Router();

router.get('/geolocation/provinces', locationController.getProvinces);
router.get('/geolocation/regencies', locationController.getRegencies);
router.get('/geolocation/districts', locationController.getDistricts);
router.get('/geolocation/villages', locationController.getVillages);

export default router;
