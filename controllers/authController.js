import User from "../model/userModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import { promisify } from "util";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";

const freshToken = (id) => {

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

}

const createSendToken = (user, statusCode, res) => {
    const token = freshToken(user._id)

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true

    res.cookie("jwt", token, cookieOptions)

    user.password = undefined

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    })

}

export const signUp = CatchAsync(async (req, res, next) => {

    const payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    }

    if (payload.name === "" || payload.email === "" || payload.password === "" || payload.passwordConfirm === "") {
        return next(new AppError("Please fill all the fields", 400))
    }

    const newUser = await User.create(payload)

    createSendToken(newUser, 201, res)
})

export const login = CatchAsync(async (req, res, next) => {

    const payload = {
        email: req.body.email,
        password: req.body.password
    }

    if (payload.email === "" || payload.password === "") return next(new AppError("Please fill all the fields", 400))

    const user = await User.findOne({ email: payload.email }).select("+password")

    if (!user || !(user.correctPassword(payload.password, user.password))) return next(new AppError("Enter a vaild email or password", 401))

    createSendToken(user, 200, res)


})


export const protect = CatchAsync(async (req, res, next) => {

    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return next(new AppError("You are not logged in! Please log in to get access", 401))

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

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
    };

    if (payload.email === "") return next(new AppError("Please fill in the email field", 400));

    const user = await User.findOne({ email: payload.email });

    if (!user) return next(new AppError("User not found with this email", 404));

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 10 minutes)",
            message: `Please use the following link to reset your password: ${resetUrl}`
        });

        res.status(200).json({
            status: "success",
            message: "Token sent to email"
        });
    } catch (err) {
        console.error('Error sending email:', err);
        
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError("There was an error sending the email. Try again later!", 500));
    }
});

export const resetPassword = CatchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) return next(new AppError("Token is invalid or has expired", 400));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
});

export const updatePassword = CatchAsync(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) return next(new AppError("Incorrect Password", 401))

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res)
})