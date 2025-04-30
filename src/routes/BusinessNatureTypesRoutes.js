import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { BusinessNatureTypesController } from '../controllers/index.js';
router.get("/BusinessNatureTypes", BusinessNatureTypesController.index);
router.post('/BusinessNatureTypes', BusinessNatureTypesController.store);
router.put('/BusinessNatureTypes/:id', BusinessNatureTypesController.update);
router.delete('/BusinessNatureTypes', BusinessNatureTypesController.destroy);
router.post('/import', BusinessNatureTypesController.import);
router.get('/export', BusinessNatureTypesController.export);
export default router;
