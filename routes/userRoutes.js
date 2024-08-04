import express from 'express';
// import {signup} from '../controllers/userController.js';
import { forgotPassword, login, protect, resetPassword, signUp, updatePassword, updateMe } from '../controllers/authController.js';
import { updateMe } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', protect , restrictTo('admin') ,signUp);
router.post('/login', login);

router.post('/forgotPasseord', forgotPassword);
router.post('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);

export default router;