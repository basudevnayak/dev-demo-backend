import { OrganizationController } from '../../controllers/index.js';
import express from 'express';
const router = express.Router();
router.post("/clientGroup", OrganizationController.store);
router.get("/clientGroup", OrganizationController.index);
router.put('/clientGroup/:id', OrganizationController.update);
router.delete('/clientGroup', OrganizationController.destroy);

export default router;