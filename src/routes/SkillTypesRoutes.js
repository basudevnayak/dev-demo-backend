import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"
import { SkillTypesController } from '../controllers/index.js';
router.get("/SkillTypes", SkillTypesController.index);
router.post('/SkillTypes', SkillTypesController.store);
router.put('/SkillTypes/:id', SkillTypesController.update);
router.delete('/SkillTypes', SkillTypesController.destroy);
router.post('/import', SkillTypesController.import);
router.get('/export', SkillTypesController.export);
export default router;
