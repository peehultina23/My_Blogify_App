import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

app.get("/", (req, res) => {
  res.send("🚀 Backend server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
