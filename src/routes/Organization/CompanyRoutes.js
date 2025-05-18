import { CompanyController } from '../../controllers/index.js';
import express from 'express';
const router = express.Router();
import {multiUploader } from "../../utils/multiUploader.js"
router.post("/company", multiUploader,CompanyController.store);
router.get("/company", CompanyController.index);
router.get("/company/:id", CompanyController.show);
router.put('/company/:id',multiUploader, CompanyController.update);
router.delete('/company', CompanyController.destroy);

export default router;