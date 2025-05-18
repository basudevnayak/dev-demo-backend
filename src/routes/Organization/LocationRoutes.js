import { LocationController } from '../../controllers/index.js';
import express from 'express';
const router = express.Router();
// import {multiUploader } from "../../utils/multiUploader.js"
router.post("/location", LocationController.store);
router.get("/location", LocationController.index);
router.put('/location/:id', LocationController.update);
router.get('/location/:id', LocationController.show);
router.delete('/location', LocationController.destroy);

export default router;