import app from "./app.js";
// import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env"
})

// mongoose.connect("mongodb+srv://aqmalfaraz:hAcker!!1@one.kj2cpwr.mongodb.net/?retryWrites=true&w=majority&appName=one",{
//   dbName: "testBackend",
// })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("ErroR connecting to MongoDB"), error
// })



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})