import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { QualificationTypesController } from '../controllers/index.js';
router.get("/QualificationTypes", QualificationTypesController.index);
router.post('/QualificationTypes', QualificationTypesController.store);
router.post("/show", QualificationTypesController.index);
router.put('/QualificationTypes/:id', QualificationTypesController.update);
router.delete('/QualificationTypes', QualificationTypesController.destroy);
router.post('/import', QualificationTypesController.import);
router.get('/export', QualificationTypesController.export);

export default router;
