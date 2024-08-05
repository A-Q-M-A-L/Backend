import express from 'express';
import { forgotPassword, login, protect, resetPassword, restrictTo, signUp, updatePassword } from '../controllers/authController.js';
import { updateMe } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', protect , restrictTo('admin') ,signUp);
router.post('/', login);

router.post('/forgotPassword', protect ,forgotPassword);
router.post('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);

export default router;