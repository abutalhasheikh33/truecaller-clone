const dotenv = require('dotenv')
dotenv.config({ path: './.env' });
const express = require('express');
const connectDB = require("./conn");
connectDB();

