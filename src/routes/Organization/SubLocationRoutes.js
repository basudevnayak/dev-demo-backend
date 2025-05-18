import { SubLocationController } from '../../controllers/index.js';
import express from 'express';
const router = express.Router();
// import {multiUploader } from "../../utils/multiUploader.js"
import {multiUploader} from "../../utils/multiUploader.js"
router.post("/SubLocation",multiUploader, SubLocationController.store);
router.get("/SubLocation", SubLocationController.index);
router.get('/SubLocation/:id', SubLocationController.show);
// router.put('/location/:id', SubLocationController.update);
// router.delete('/location', SubLocationController.destroy);

export default router;