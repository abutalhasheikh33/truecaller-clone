const signToken = require("../utils/signToken");
const verifyPassword = require("../utils/verifyPassword");
const User = require("../models/User");


const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const runRedisServer = require("../redisConn");
const jwt = require("jsonwebtoken");


exports.register = catchAsync(async (req, res, next) => {
    const { username, email, password, name, role } = req.body;
    
  
    // Validate that all required fields are provided
    if (!username || !name || !email || !password) {
      return next(new AppError("Fill every field", 404));
    }


  
    // Create a new user
    const newRegister = await Model.create({
      username,
      email,
      password,
      name
    });
  
    // Create a JWT token for the new company
    const payload = {
      email: newRegister.email,
      id: newRegister._id,
      name: newRegister.name
    };
    const token = await signToken(payload);
  
    // Send response with the new company and JWT token
    res.status(200).json({
      message: `A new ${role} just registered`,
      [`${role}`]: newRegister,
      token,
    });
  });