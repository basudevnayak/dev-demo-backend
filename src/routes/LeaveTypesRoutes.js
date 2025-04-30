import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { LeaveTypesController } from '../controllers/index.js';
router.get("/LeaveTypes", LeaveTypesController.index);
router.post('/LeaveTypes', LeaveTypesController.store);
router.put('/LeaveTypes/:id', LeaveTypesController.update);
router.delete('/LeaveTypes', LeaveTypesController.destroy);
router.post('/import', LeaveTypesController.import);
router.get('/export', LeaveTypesController.export);
export default router;
