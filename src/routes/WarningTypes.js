import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { WarningTypesController } from '../controllers/index.js';
router.get("/WarningTypes", WarningTypesController.index);
router.post('/WarningTypes', WarningTypesController.store);
router.put('/WarningTypes/:id', WarningTypesController.update);
router.delete('/WarningTypes', WarningTypesController.destroy);
router.post('/import', WarningTypesController.import);
router.get('/export', WarningTypesController.export);
export default router;
