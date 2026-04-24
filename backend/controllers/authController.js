import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const isGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
const isMobile = (m) => /^[0-9]{10}$/.test(m);

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, dob, password } = req.body;

    if (!name || !email || !mobile || !dob || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!isGmail(email)) {
      return res.status(400).json({ message: "Only Gmail allowed" });
    }

    if (!isMobile(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password min 6 chars" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      mobile,
      dob,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      user: {
        _id: newUser._id,
        name,
        email,
        mobile,
        dob,
      },
      token,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROFILE
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -__v");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateUser = async (req, res) => {
  try {
    const { name, mobile, dob } = req.body;

    if (!name || !mobile || !dob) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!isMobile(mobile)) {
      return res.status(400).json({ message: "Invalid mobile" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, mobile, dob },
      { new: true, runValidators: true }
    ).select("-password -__v");

    res.json({ user: updatedUser });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User already deleted" });
    }

    res.json({ message: "Account deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};