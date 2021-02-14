//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();



app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

const uri="mongodb://localhost:27017/userDB";

mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true})

const connection = mongoose.connection;
connection.once("open",function(err){
  if(!err){
    console.log("MongoDB Spinning upp....");
  }
})

const userSchema= new mongoose.Schema({
  email:{type:String,required:true},
  password:{type:String,required:true}
});

// USE ENCRYPTION before model

const secrets=process.env.SECRETS;

//contains ASSINGNING KEY and SIGNING KEY
//ENCRYPTION for specific field,IN the encryptedFeild set value inside  ARRAY..
//NOTE** AutoMaticallY --> ENCRYPTS while calling SAVE() and DECRYPTS while calling FIND()
userSchema.plugin(encrypt,{secret:secrets,encryptedFeilds:["password"],excludeFromEncryption: ['email'] });

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home")
})

app.get("/login",function(req,res){
  res.render("login")
})

app.post("/login",function(req,res){
const username=req.body.username;
const password=req.body.password;

User.findOne(
  {email:username},
  function(err,result){
    if(!err){
      if(result){
        if( result.password===password)
        res.render("secrets")
      }else{
        res.send(err)
      }
    }
  })

})

app.get("/register",function(req,res){
  res.render("register")
})

app.post("/register",function(req,res){
console.log(req.body.username);
console.log(req.body.password);

const user= new User({
  email:req.body.username,
  password:req.body.password
});

user.save(function(err){
  if(err){
    res.send(err)
  }else{
    res.render("secrets")
  }
})

})

app.listen(3000,function(req,res){
  console.log("Server on port : 3000");
})
