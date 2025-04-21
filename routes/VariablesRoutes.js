import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { DepartmentsController } from '../controllers/index.js';
router.get("/departments", DepartmentsController.index);
router.post('/departments', DepartmentsController.store);
router.post("/show", DepartmentsController.index);
router.put('/departments/:id', DepartmentsController.update);

export default router;
