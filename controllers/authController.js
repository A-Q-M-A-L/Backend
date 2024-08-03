import { nextTick } from "process";
import User from "../model/userModel";

export const signUp = CatchAsync( async (req, res) => {
  
    const payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    }

    if(payload.name === "" || payload.email === "" || payload.password === "" || payload.passwordConfirm === ""){
        return next(new AppError("Please fill all the fields", 400))
    }

    const newUser = await User.create(payload)

    res.status(200).json({
        message: "Signup successfully",
        data: {
            newUser
        }

    })
})