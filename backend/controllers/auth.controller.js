import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// User Signup Controller
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password || username.trim() === "" || email.trim() === "" || password.trim() === "") {
      return next(errorHandler(400, "All fields are required!"));
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "Email is already registered!"));
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user
    await newUser.save();

    // Send response
    res.status(201).json({
      success: true,
      message: "Signup successful!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
