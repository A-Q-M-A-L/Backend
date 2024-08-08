import User from "../model/userModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import multer from "multer";
import sharp from "sharp";

const multerStorege = multer.memoryStorage()

const upload = multer({
    storage: multerStorege,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        } else {
            cb(new AppError('Not an image! Please upload only images.', 400), false)
        }
    }
})

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = CatchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);   


    next();
})

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;

}



// Update user details
export const updateMe = CatchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Update user document
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;
    const updatedUser = await User.findByIdAndUpdate({ _id: req.user.id }, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    })
})

// Delete user
export const deleteMe = CatchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(204).json({
        status: 'success',
        data: null,
    })

})

// Get All User 
export const getAllUsers = CatchAsync(async (req, res, next) => {
    const users = await User.find({ isActive: true });

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    })
})


// Get Single User
export const getSingleUser = CatchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    })
})


// Create User
export const createUser = CatchAsync(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            user,
        },
    })
})