const mongoose = require("mongoose")
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Connected");
})
.catch((err)=>{
    console.log("Not ",err.message)
})