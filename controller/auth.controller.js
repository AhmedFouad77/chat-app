const userModel = require('../models/user.model');
const validation = require('../validation/auth.validatio');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const privateKey = 'THIS IS MY SECRET KEY TO LOGIN USER';
const crypto = require("crypto");
const nodemailer = require('nodemailer');




//  Get The Data That Stored In The Cookie
function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;
    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
};



exports.signUp = async (req ,res)=>{
    try{
        console.log('----------------------')
        // console.log(req.body)
        // validation
        try{
            var validate=await validation.siginupValidation(req.body);
        }catch(e){
        return res.json({success:false , msg : e.details[0].message})
        }
        if(req.body.password != req.body.confirmPassword) return res.json({success:false , msg :'Password And ConfirmPassword Not Match !'})
        // Chek if registerd or No 
       let isfound = await userModel.findOne({email:req.body.email});
       if(isfound) return res.json({success:false, msg:'sorry This Email Is Already Sign Up !'});
        // hash passwod
        var salt = bcrypt.genSaltSync(10);
        var hash =await bcrypt.hashSync(req.body.password, salt); 
        let user =await  new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password:hash ,
        })

    let newUser =  await user.save();
    return  res.json({success:true , msg:'User Creted Successfully '});
    
    }catch(e){
        console.log(e)
    return res.json({success:false , msg:"Not Saved" , e :e})
    }
};


exports.login = async (req ,res)=>{
    try{
        // validation
        var validate=await validation.loginValidation(req.body);
        if(validate.error) return  res.send(validate.error);
        // Chek if registerd or No 
       let user = await userModel.findOne({email:req.body.email});
       if(!user) return res.send('Sorry Email Or Password Not Right !');
        // commpare passwod
      let comparePass = await  bcrypt.compareSync(req.body.password , user.password);
      if(!comparePass) return res.send('Sorry Email Or Password Not Right !');
        
      let date = {id:user._id,email:user.email };
      let Token = jwt.sign(date, privateKey);
    
    return  res.cookie("Token", Token).status(200).json({success:true,msg:'loged',Token:Token});
    }catch(e){
    return res.status(400).send(e.message);
    }
  
};

exports.logOut = async (req ,res)=>{
    try{
        res.clearCookie("Token").send('logout !');
    }catch(e){
    return res.status(400).send(e.message);
    }
  
};


// resetPassword
exports.SendEmailResetPassword = async(req,res) =>{

    try{
    var x = await validation.isEmail(req.body);
    }catch(e){
         return res.status(400).json({success:false , msg:e.details[0].message});
    }
    // if user valid 
    let user = await userModel.findOne({email:req.body.email});
    if(!user) return res.status(400).json({success:false , msg:'This User Not Found !'});
   
    // create token
    let buffer = await crypto.randomBytes(32);
    let token = await buffer.toString('hex');


    // save Token in User Model
    let updateUserToken = await userModel.findOneAndUpdate({email:req.body.email},{$set:{TokenResetPassword:token}});
    if(!updateUserToken)return res.status(400).json({success:false , msg:'Bad Request !'});

    // Start Send Email   
    var client = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'wwork1050',
            pass: '123456@Aa'
        }
    });

    var email = {
        from: 'info@Frinds',
        to: req.body.email,
        subject: 'Reset your password',
        text: 'Reset your password',
        html: `<h1>
        Hi, to reset your password
          <a href="http://localhost:3000/${token}">click here to reset</a>
          </h1>`
    };
    let send = await client.sendMail(email);

    if(send) return res.json({success:true , msg:'We Send You Email on your Gmail TO Rest Password' , "token": token});
    return res.status(400).json({success:false , msg:'Bad Request !'});

};


exports.resetPassword = async(req,res)=>{
const Token = req.params.Token;
// if user
 let user = await userModel.findOne({TokenResetPassword:Token});

 if(!user) return res.status(400).json({success:false , msg:'Bad Request !'});

//  Start Validation on Password And ConfirmPassword
 try{
    let vald = await validation.passAndConfirm(req.body);
}catch(e){
    console.log(e)
    return res.status(400).json({success:false , msg:e.details[0].message});
};
    if(req.body.password != req.body.confirmPassword)return res.status(400).json({success:false , msg:'Sorry The Password And Cofirm Password Not Match !'});
    // hash passwod
    var salt = bcrypt.genSaltSync(10);
    var hash =await bcrypt.hashSync(req.body.password, salt);

    // save The New Password
         user.password = hash;
         user.TokenResetPassword = undefined;
         let user2 = await user.save();
         return res.status(200).json({success:true , msg:"reset Your Password Successfully "});

};

// Change Password
exports.changePassword = async (req,res) => {

    let Token =   parseCookies(req).Token
    var decoded = jwt.verify(Token,privateKey);
    let id =  decoded.id; 

    // Find On User First 
    let user = await userModel.findById(id);

    // Validation On Password
    try{
    let vald = await validation.passAndConfirm(req.body);
    if(req.body.password != req.body.confirmPassword)return res.status(400).json({success:false,msg:'Password And Confirm Password Not Match !'})
    }catch(e){
        return res.send(e.details[0].message)
    };
    salt = bcrypt.genSaltSync(10);
    hash = await bcrypt.hashSync(req.body.password);

    user.password = hash;
    let updatePass = await user.save();
    if(!updatePass)return res.status(400).json({success:false,msg:'Bad Requset !'})
    return res.status(200).json({success:true,msg:'Password Changed Successfully '})
}