import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { DesignationsController } from '../controllers/index.js';
router.get("/Designations", DesignationsController.index);
router.post('/Designations', DesignationsController.store);
router.post("/show", DesignationsController.index);
router.put('/Designations/:id', DesignationsController.update);
router.delete('/Designations', DesignationsController.destroy);
export default router;
