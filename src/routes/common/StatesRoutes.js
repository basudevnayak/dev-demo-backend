import express from 'express';
const router = express.Router();
import {StatesController} from '../../controllers/index.js';

router.get("/state", StatesController.index);
router.post("/state", StatesController.store);
router.put("/state/:id", StatesController.update);
router.get("/state/:id", StatesController.select);
export default router;
