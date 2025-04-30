import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { AwardTypesController } from '../controllers/index.js';
router.get("/AwardTypes", AwardTypesController.index);
router.post('/AwardTypes', AwardTypesController.store);
router.put('/AwardTypes/:id', AwardTypesController.update);
router.delete('/AwardTypes', AwardTypesController.destroy);
router.post('/import', AwardTypesController.import);
router.get('/export', AwardTypesController.export);
export default router;
