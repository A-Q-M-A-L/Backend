import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Password should be atleast 8 characters"],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please re-enter your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    }
  }
})

// MIDDLEWARES

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
})

// Functions
userSchema.methods.correctPassword = async function (candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model("User", userSchema);

export default User;