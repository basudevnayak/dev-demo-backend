import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { ArrangementTypesController } from '../controllers/index.js';
router.get("/ArrangementTypes", ArrangementTypesController.index);
router.post('/ArrangementTypes', ArrangementTypesController.store);
router.post("/show", ArrangementTypesController.index);
router.put('/ArrangementTypes/:id', ArrangementTypesController.update);
router.delete('/ArrangementTypes', ArrangementTypesController.destroy);
router.post('/import', ArrangementTypesController.import);
router.get('/export', ArrangementTypesController.export);

export default router;
