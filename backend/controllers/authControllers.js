const signToken = require("../utils/authUtils/signToken");
const verifyPassword = require("../utils/authUtils/verifyPassword");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const otpGenerator = require('otp-generator')
const runRedisServer = require("../redisConn");
const jwt = require("jsonwebtoken");
const extractBearerToken = require('../utils/authUtils/extractBearerToken')
const addToBlacklist = require('../utils/authUtils/blacklistToken')
const { promisify } = require("util");
const Global = require("../models/Global");
const List = require('../models/List');
const Otp = require("../models/Otp");
const mailSender = require('../utils/mailUtils/mailSender')
exports.register = catchAsync(async (req, res, next) => {
    const { phoneNumber, email, password, name, city,country,otp } = req.body;
    
  
    // Validate that all required fields are provided
    if (!phoneNumber|| !name || !email || !password || !otp ) {
      return next(new AppError("Fill every field", 404));
    }

    const exitingUser = await User.findOne({ email })
    if (exitingUser) {
        return res.status(400).json({
            success: false,
            message: "user already registered"
        })
    }

       // find most recent otp stored for the user 
       const recentOtp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)
       console.log(`resentOtp : -> ${recentOtp}`);
       console.log(`${email}`);
      // validate otp 
      if (recentOtp.length === 0) {
        return next(new AppError("Otp not found",400))
    } else if (otp != recentOtp[0].otp) {
        return next(new AppError("Invalid Otp",400))
    }

    // Check if the contact already exists globally
      let globalContact = await Global.findOne({ phoneNumber });
      let list;

    // If the contact doesn't exist globally, create a new one
      if (!globalContact) {
          globalContact = await Global.create({ name, phoneNumber });
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

    // Create a contact list for the registered contact
    
    const newList = await List.create({userId:newRegister._id,list:[]});
    newRegister.personalContacts = newList._id;
    newRegister.save();

    // after contact registered also create a copy in global db 
    if(globalContact.name[0] === '$Unknown'){  await Global.findByIdAndUpdate(globalContact._id,{ name:[name] }); }
    else { await Global.findByIdAndUpdate(globalContact._id,{ $push: { name } }); }

    // Create a JWT token for the new company
    const payload = {
      email: newRegister.email,
      id: newRegister._id,
      name: newRegister.name,
      phoneNumber: newRegister.phoneNumber
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
      phoneNumber: document.phoneNumber
      
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
  await redisClient.quit();
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
  await redisClient.quit();
  // Send response with success message
  res.status(200).json({
    message: "Logged out successfully",
  });

});


// otp generator
exports.sendOtp = catchAsync( async (req, res,next) => {
 
      // fetch email
      const { email } = req.body

      // check if user is already exits
      const checkUserPresent = await User.findOne({ email })

      // if user already exit , return response
      if (checkUserPresent) {
          return next(new AppError("User already registered",401));
      }

      // generate otp
      let otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false
      });
      console.log(`generated otp are  : - > ${otp}`);

      // check unique otp or not
      let result = await Otp.findOne({ otp: otp })
      while (result) {
          otp = otpGenerator.generate(6, {
              upperCaseAlphabets: false,
              lowerCaseAlphabets: false,
              specialChars: false
          });
          result = await Otp.findOne({ otp: otp })
      }
      const otpPayload = { email, otp }

      // create an entry in db
      const otpBody = await Otp.create(otpPayload)

      // return success response
      return res.status(200).json({
          success: true,
          message: "otp sent successfully",
          data: otpBody
      })
  

    
  
})
