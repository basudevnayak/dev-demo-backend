import express from 'express';
const router = express.Router();
import {QrCodeController} from '../../controllers/index.js'
router.get("/qrcode/:phone", QrCodeController.qrCodeGenerate);
export default router;
