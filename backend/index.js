import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

dotenv.config()
mongoose.connect(process.env.MONGO_URI).then(
    () =>{
        console.log("Database is connected!")
    }
).catch((err)=>{
    console.log(err)
})

const app = express();
const PORT = 3000;

//for allowing json object in req body
app.use(express.json())

app.get("/", (req, res) => {
  res.send("🚀 Backend server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 
app.use("/api/auth", authRoutes)