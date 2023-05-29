import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import { userModel } from "../../../database/models/user.model.js";
import AppError from "../../utlis/services/AppError.js"; 
import mongoose from "mongoose";
const { Jwt } = jwt;
//               1-SIGNUP
export const signUp=catchAsyncError(async(req,res,next)=>{
  try{
    let isFound=await userModel.findOne({email:req.body.email});
  if(isFound)next(new AppError("EMAIL ALREADY EXIST",409));
  let user=new userModel(req.body);
  await user.save();;
  res.status(201).json({message:"USER ADDED...",user});
  }catch(err){
    console.log(err);
    res.status(401).json({message:"ERROR!!!!",err});
  }
})
//               2-SIGNIN
export const signIn=catchAsyncError(async(req,res,next)=>{
  try{
    const{email,password}=req.body;
    let isFound=await userModel.findOne({email});
    const match=await bcrypt.compareSync(password,isFound.password);
    if(isFound&&match){
      let token=jwt.sign({name:isFound.name,
                    userId:isFound._id,
                    role:isFound.role},process.env.JWT_key);
      return res.status(200).json({message:"LOGIN SUCCESS...",token});
    }else{
      next(new AppError("INCORRECT EMAIL OR PASSWORD!!!!",401));
    }
  }catch(err){
    console.log(err);
    res.status(401).json({message:"EROR!!!!",err});
  }
})
//                      3-AUTHENTICATION
export const protectRoutes=catchAsyncError(async(req,res,next)=>{
  try{
    let{token}=req.headers;
    if(!token)return next(new  AppError("PLEASE PROVIDE TOKEN!!",401));

    let decoded=await jwt.verify(token,process.env.JWT_key);
    //console.log(decoded)
    let user=await userModel.findById(decoded.userId);
    if(!user)return next(new AppError("invalid user ",401));

    let changePasswordDate;
    if (user.changePasswordAt) {
      changePasswordDate = parseInt(user.changePasswordAt.getTime() / 1000);
      if(changePasswordDate>decoded.iat) return next(new AppError("Invalid TOKEN!!!!",401));
    } else { 
    req.userId=user._id;
    next();
  }
  }catch(err){
    console.log(err);
    res.status(401).json({message:"ERROR!!!!",err});
  }
})
//                        5-AUTHORIZATION
export const allowTo=(...roles)=>{
  try{
      return catchAsyncError((req,res,next)=>{
      if(!roles.includes(req.user.role))
      return next (new AppError("NOT AUTHORIZED!!!",403));
      next();
    })
  }catch(err){
    console.log(err);
    res.status(401).json({message:"EROR!!!!",err});
  }
}
//                        6-LOGOUT
export const logout =async(req,res,next)=>{
  try{
    const{email}=req.body;
    const userExists=await userModel.findOne({email});
    const userOut=await userModel.findOneAndUpdate({email,isActive:true},{isActive:false,lastSeen:Date.now()});
    if(userOut){
      res.status(200).json({message:"USER LOGGED OUT......"});
    }else{
      res.status(400).json({message:"FALI IN LOGOUT!!!!!!!!!!"});
    }
  }catch(err){
    console.log(err);
    res.status(401).json({message:"EROR!!!!",err});
  }
}