import { ClientGroupController } from '../../controllers/index.js';
import express from 'express';
const router = express.Router();
router.post("/clientGroup", ClientGroupController.store);
router.get("/clientGroup", ClientGroupController.index);
router.put('/clientGroup/:id', ClientGroupController.update);
router.delete('/clientGroup', ClientGroupController.destroy);

export default router;