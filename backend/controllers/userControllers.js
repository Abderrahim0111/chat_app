const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.json({ error: "all fields are required" });
  }
  try {
    const isUsername = await User.findOne({ username });
    if (isUsername) {
      return res.json({ error: "username taken" });
    }
    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return res.json({ error: "email taken" });
    }
    const user = await User.create(req.body);
    if (!user) {
      return res.json({ error: "registration error" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("jwt", token, { 
      httpOnly: true, 
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds 
      secure: true, // Set the secure attribute
      sameSite: 'none' // Allow cross-site cookies
    });
    const { password, ...rest } = user._doc;
    res.json(rest);
  } catch (error) {
    res.json({ error: error });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ error: "all fields are required" });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ error: "user not found, register to continue" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.json({ error: "incorrect password" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("jwt", token, { 
    httpOnly: true, 
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds 
    secure: true, // Set the secure attribute
    sameSite: 'none' // Allow cross-site cookies
  });
  const { password: pass, ...rest } = user._doc;
  res.json(rest);
};

const logout = (req, res) => {
  if (!req.cookies.jwt) {
    return res.json({ error: "not allowed" });
  }
  try {
    res.clearCookie("jwt");
    res.json({message: 'user logged out'})
  } catch (error) {
    res.json({ error: error });
  }
};

const fetchAllUsers = async (req, res) => {
  if (!req.cookies.jwt) {
    return res.json({ error: "not allowed" });
  }
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const allUsers = await User.find({ _id: { $ne: decoded.id } });
    if (!allUsers) {
      return res.json({ error: "fetching error" });
    }
    const sanitizedUsers = allUsers.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    res.json(sanitizedUsers);
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = {
  register,
  login,
  fetchAllUsers,
  logout,
};
