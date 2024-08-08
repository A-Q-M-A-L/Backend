import express from 'express';
import { forgotPassword, login, protect, resetPassword, restrictTo, signUp, updatePassword } from '../controllers/authController.js';
import { createUser, getAllUsers, resizeUserPhoto, updateMe, uploadUserPhoto } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', protect , restrictTo('admin', 'projectManager') ,signUp);
router.post('/', login);

router.post('/forgotPassword', protect ,forgotPassword);
router.post('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto,updateMe);

router.route('/')
.get(protect, restrictTo('admin', 'projectManager'), getAllUsers)
.post(protect, restrictTo('admin', 'projectManager'), createUser)
.patch(protect, restrictTo('admin'), updateMe)


export default router;