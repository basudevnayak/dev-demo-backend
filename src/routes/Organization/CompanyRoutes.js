import { CompanyController } from '../../controllers/index.js';
import express from 'express';
const router = express.Router();
// import {multiUploader } from "../../utils/multiUploader.js"
router.post("/company", CompanyController.store);
router.get("/company", CompanyController.index);
router.put('/company/:id', CompanyController.update);
router.delete('/company', CompanyController.destroy);

export default router;