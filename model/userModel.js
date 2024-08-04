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
  role:{
    type: String,
    enum: ["employee", "projectManager", "admin"],
    default: "employee"
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false
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
  },
  passwordChangedAt: Date, // Date when password was changed
  passwordResetToken: String,
  passwordResetExpires: Date,
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

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
})

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
})

// Functions
// Password Checking Function
userSchema.methods.correctPassword = async function (candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
}

// Password Changed After Function
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;

}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;

}

const User = mongoose.model("User", userSchema);

export default User;