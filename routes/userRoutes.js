import express from 'express';
// import {signup} from '../controllers/userController.js';
import { signUp } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUp);

export default router;