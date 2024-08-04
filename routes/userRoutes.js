import express from 'express';
// import {signup} from '../controllers/userController.js';
import { forgotPassword, login, protect, resetPassword, signUp, updatePassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

router.post('/forgotPasseord', forgotPassword);
router.post('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

export default router;