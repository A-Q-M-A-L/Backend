import User from "../model/userModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import { promisify } from "util";
const freshToken = (id) => {

    return jwt.sign({ id }, "process.env.JWT_SECRET", {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

}


export const signUp = CatchAsync(async (req, res) => {

    const payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    }

    if (payload.name === "" || payload.email === "" || payload.password === "" || payload.passwordConfirm === "") {
        return next(new AppError("Please fill all the fields", 400))
    }

    const newUser = await User.create(payload)

    res.status(200).json({
        message: "Signup successfully",
        token: freshToken(newUser._id),
        data: {
            newUser
        }

    })
})

export const login = CatchAsync(async (req, res) => {

    const payload = {
        email: req.body.email,
        password: req.body.password
    }

    if (payload.email === "" || payload.password === "") return next(new AppError("Please fill all the fields", 400))

    const user = await User.findOne({ email: payload.email }).select("+password")

    if (!user || !(user.correctPassword(payload.password, user.password))) return next(new AppError("Enter a vaild email or password", 401))

    res.status(200).json({
        message: "Login successfully",
        token: freshToken(user._id)
    })


})


export const protect = CatchAsync(async (req, res, next) => {

    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return next(new AppError("You are not logged in! Please log in to get access", 401))

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, "process.env.JWT_SECRET");

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new AppError("This user no longer exists", 401));

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) return next(new AppError("User recently changed password! Please log in again", 401));

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
})

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403))
        }
        next()
    }

}

export const forgotPassword = CatchAsync(async (req, res, next) => {
    
    const payload = {
        email: req.body.email
    }

    if (payload.email === "") return next(new AppError("Please fill all the fields", 400))

    const user = await User.findOne({ email: payload.email })

    if (!user) return next(new AppError("User not found with this email", 404))

    const restToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })

     const restUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${restToken}`

     try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 10 minutes)",
            message: restUrl
        })
     }catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false })
     }

    res.status(200).json({
        message: "Token sent to email"
    })
})

export const resetPassword = CatchAsync(async (req, res, next) => {

    
})