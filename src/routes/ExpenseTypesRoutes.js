import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { ExpenseTypesController } from '../controllers/index.js';
router.get("/ExpenseTypes", ExpenseTypesController.index);
router.post('/ExpenseTypes', ExpenseTypesController.store);
router.post("/show", ExpenseTypesController.index);
router.put('/ExpenseTypes/:id', ExpenseTypesController.update);
router.delete('/ExpenseTypes', ExpenseTypesController.destroy);
router.post('/import', ExpenseTypesController.import);
router.get('/export', ExpenseTypesController.export);

export default router;
