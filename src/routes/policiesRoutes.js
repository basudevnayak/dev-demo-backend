import express from 'express';
const router = express.Router();

import { PolicyController } from '../controllers/index.js';
router.post("/policies", PolicyController.create);
// router.post("/signup", PolicyController.register);
router.get("/policies", PolicyController.index);
router.delete("/policies/:id", PolicyController.destroy);
router.put("/policies/:id", PolicyController.update);
router.get("/policies/:id", PolicyController.show);

export default router;
