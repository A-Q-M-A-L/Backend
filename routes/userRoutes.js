import express from 'express';
// import {signup} from '../controllers/userController.js';
import { login, signUp } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

router.post('/forgetPasseord', forgetPassword);

export default router;