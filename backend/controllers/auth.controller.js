import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // ✅ Only check email & password for signin
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "Email and password are required!"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Wrong credentials."));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
