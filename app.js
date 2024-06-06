const bodyParser=require('body-parser');
const express = require("express");
const router =require('./src/routes/api');

const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp=require('hpp');
const cors=require('cors');
const mongoose = require("mongoose");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");



//Cors Setup
app.use(cors());
//Security Implementation
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 2000 }) // 10 minutes
app.use(limiter );

// Database Connection
const URI = "mongodb+srv://hamidbd2310:Hamid121@cluster0.asvkdue.mongodb.net/userRole";
const OPTION = { user: '', pass: '' ,autoIndex: true };
mongoose.connect(URI, OPTION)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });


  app.set('etag', false);

//Router Setup
 app.use('/api',router);
 app.use(express.static('client/dist'));


 
// Add React Front End Routing
app.get('*',function (req,res) {
  res.sendFile(path.resolve(__dirname,'client','dist','index.html'))
})

//404 Not Found
  app.use("*",(req, res) =>
  res.status(404).json({
    success: false,message: "Page not found",}))

module.exports = app;