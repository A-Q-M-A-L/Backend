import express from 'express';
import { forgotPassword, login, protect, resetPassword, restrictTo, signUp, updatePassword } from '../controllers/authController.js';
import { createUser, deleteMe, getAllUsers, resizeUserPhoto, updatedUser, updateMe, uploadUserPhoto } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', protect, restrictTo('admin', 'projectManager'), signUp);
router.post('/', login);
router.post('/create', protect, restrictTo('admin', 'projectManager'), uploadUserPhoto, resizeUserPhoto, createUser)

router.post('/forgotPassword', protect, forgotPassword);
router.post('/resetPassword/:token', resetPassword);

router.delete('/dadeleteka/:id', protect, restrictTo('admin'), deleteMe)

router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto, updateMe);
router.patch('/updateUser/:id', protect, uploadUserPhoto, resizeUserPhoto, updatedUser);

router.route('/')
    .get(protect, restrictTo('admin', 'projectManager'), getAllUsers)


// .patch(protect, restrictTo('admin'), updateMe)


export default router;