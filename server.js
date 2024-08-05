import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env"
})

const DBConnect = async () => {
  try {
    await mongoose.connect('mongodb+srv://hello:UQOl1iICDvIci7SU@one.kj2cpwr.mongodb.net/?retryWrites=true&w=majority&appName=one');
    console.log("MongoDB connected successfully");
  }
  catch (error) {

    console.log("MongoDB connection failed" + error.message)

  }
}
DBConnect();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
