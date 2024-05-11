const signToken = require("../utils/authUtils/signToken");
const verifyPassword = require("../utils/authUtils/verifyPassword");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const runRedisServer = require("../redisConn");
const jwt = require("jsonwebtoken");
const extractBearerToken = require('../utils/authUtils/extractBearerToken')
const addToBlacklist = require('../utils/authUtils/blacklistToken')
const { promisify } = require("util");
const Global = require("../models/Global");
const List = require('../models/List')
exports.register = catchAsync(async (req, res, next) => {
    const { phoneNumber, email, password, name, city,country } = req.body;
    
  
    // Validate that all required fields are provided
    if (!phoneNumber|| !name || !email || !password) {
      return next(new AppError("Fill every field", 404));
    }

    // Check if the contact already exists globally
      let globalContact = await Global.findOne({ phoneNumber });
      let list;

    // If the contact doesn't exist globally, create a new one
      if (!globalContact) {
          globalContact = await Global.create({ name, phoneNumber });
      }
      else{
        if(globalContact.name[0] === '$Unknown'){  await Global.findByIdAndUpdate(globalContact._id,{ name:[name] }); }
        else { await Global.findByIdAndUpdate(globalContact._id,{ $push: { name } }); }
      }
    
  
    // Create a new user
    const newRegister = await User.create({
      phoneNumber,
      email,
      password,
      name,
      city,
      country
    });
    
    const newList = await List.create({userId:newRegister._id,list:[]});
    newRegister.personalContacts = newList._id;
    newRegister.save();
    // Create a JWT token for the new company
    const payload = {
      email: newRegister.email,
      id: newRegister._id,
      name: newRegister.name
    };
    const token = await signToken(payload);
  
    // Send response with the new company and JWT token
    res.status(200).json({
      message: `A new user just registered`,
      user: newRegister,
      token,
    });
  });


  exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    // Validate that email and password are provided
    if (!email || !password) {
      return next(new AppError("Cannot leave email or password field blank"));
    }

    
    // Find the document with the provided email
    const document = await User.findOne({ email });
  
    // Validate that the document exists
    if (!document) {
      return next(new AppError(`User not found`, 404));
    }
  
    // Validate the provided password against the stored hashed password
    const isPasswordValid = await verifyPassword(password, document.password);
  
    // If password is not valid, send an error response
    if (!isPasswordValid) {
      return next(new AppError("Enter the correct password"));
    }
  
    // Create a JWT token for the logged-in user
    const payload = {
      email: document.email,
      id: document._id,
      name: document.name,
      
    };
    const token = await signToken(payload);
  
    // Send response with success message, user information, and JWT token
    res.status(201).json({
      status: "SUCCESS",
      message: "Login successful",
      user: document,
      token,
    });
  });

  // Verify the JWT token and check if it is in the Redis blacklist
exports.verifyToken = catchAsync(async (req, res, next) => {
  // Connect to Redis server
  let redisClient = await runRedisServer();
  await redisClient.connect();

  // Extract Bearer token from the request
  const token = extractBearerToken(req);

  // If no token is provided, send an error response
  if (!token) {
    return next(new AppError("You are not logged in to gain access"));
  }

  // Verify JWT token using the secret key
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if token is in Redis blacklist
  const find = await redisClient.get(token);

  // If token is in the blacklist, send an error response
  if (find) {
    return next(new AppError("Token invalid"));
  }

  // Attach decoded user information to request object for further processing
  req.user = decoded;

  // Continue to the next middleware/controller
  next();
});

// Logout a user by adding the JWT token to the Redis blacklist
exports.logout = catchAsync(async (req, res, next) => {
  // Connect to Redis server
  let redisClient = await runRedisServer();
  await redisClient.connect();

  // Extract Bearer token from the request
  const token = extractBearerToken(req);

  // If no token is provided, send an error response
  if (!token) {
    return next(new AppError("You are not logged in "));
  }

  // Add token to Redis blacklist
  await addToBlacklist(redisClient, token);

  // Send response with success message
  res.status(200).json({
    message: "Logged out successfully",
  });

});