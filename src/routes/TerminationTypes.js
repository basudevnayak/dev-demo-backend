import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { TerminationTypesController } from '../controllers/index.js';
router.get("/TerminationTypes", TerminationTypesController.index);
router.post('/TerminationTypes', TerminationTypesController.store);
router.post("/show", TerminationTypesController.index);
router.put('/TerminationTypes/:id', TerminationTypesController.update);
router.delete('/TerminationTypes', TerminationTypesController.destroy);
export default router;
