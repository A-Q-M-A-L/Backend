import User from "../model/userModel.js";
import CatchAsync from "../utils/CatchAsync.js";

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