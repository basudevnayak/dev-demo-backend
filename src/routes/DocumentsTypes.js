import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { DocumentsTypesController } from '../controllers/index.js';
router.get("/DocumentsTypes", DocumentsTypesController.index);
router.post('/DocumentsTypes', DocumentsTypesController.store);
router.put('/DocumentsTypes/:id', DocumentsTypesController.update);
router.delete('/DocumentsTypes', DocumentsTypesController.destroy);
router.post('/import', DocumentsTypesController.import);
router.get('/export', DocumentsTypesController.export);
export default router;
