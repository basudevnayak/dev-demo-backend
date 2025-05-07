import express from 'express';
const router = express.Router();
import {CountriesController} from '../../controllers/index.js';
router.get("/countries", CountriesController.index);

export default router;