const express = require("express")
const router = express.Router();

const signup= require("../models/signupSchema")
const bcrypt= require("bcryptjs")



router.post("/",async(req,res)=>{
    const {name,email,password}=req.body;
  

    try {
        let existing=await signup.findOne({email})
        if(existing)
        {
            return res.status(400).json({
                errorField: "email",
                message: "User is already registered",
              });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =await  bcrypt.hash(password, salt);

        const newUser= new signup({
            name,
            email,
            password:hashedPassword,
         })

         const temp=await newUser.save();
         if(!temp)
         {
            res.send(400);
         }
         else{
            res.status(200).json({
                message: "User register successfully",
                userId:newUser._id
              });
         }


    } catch (err) {
        res.send("error").status(400);
        
    }
})


module.exports = router;

