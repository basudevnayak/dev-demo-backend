import express from 'express';
const router = express.Router();

import { AuthController } from '../controllers/index.js';
router.post("/signin", AuthController.login);
router.post("/signup", AuthController.register);
router.post("/deleteUser", AuthController.logout);
router.get("/showUser", AuthController.index);

export default router;
