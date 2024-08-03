import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validato: [validator.isEmail, "Please enter a valid email"],
  },
  photo:{
    type:String
  },  
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
  passwordConfirm: {
    type:String,
    required: [true, "Please re-enter your password"],
  }
 
 
})

const User = mongoose.model("User", userSchema);

export default User;