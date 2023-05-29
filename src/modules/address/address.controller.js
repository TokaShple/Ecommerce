import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import { userModel } from "../../../database/models/user.model.js";
import AppError from "../../utlis/services/AppError.js";
import { productModel } from "../../../database/models/product.model.js";
import mongoose from "mongoose";

//CRUD
//////   1-CREATE
const addToAddress =catchAsyncError(async(req,res,next)=>{
  try{
      let userId=req.userId;
      let address= await userModel.findByIdAndUpdate(userId,{$addToSet:{address:req.body}},{new:true});
      let saveAddress= await address.save();
      saveAddress && res.status(201).json({message:"ADDRESS ADDED..........",saveAddress});
      !saveAddress && next (new AppError("ADDRESS NOT SAVED!!!!!!",400));
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   2-DELETE 
const removeFromAddress=catchAsyncError(async(req,res,next)=>{
  try{
      let userId=req.userId;
      let address= await userModel.findByIdAndUpdate(userId,{$pull:{address:{_id:req.body.address}}},{new:true});
      address && res.status(201).json({message:"ADDRESS REMOVED..........",address});
      !address && next (new AppError("ADDRESS NOT REMOVED!!!!!!",400));
    
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   3-GET ALL
const getAllAddress=catchAsyncError(async(req,res,next)=>{
  try{
    let userId=req.userId;
    let address=await userModel.findById(userId);
    ! address&& next(new AppError("NOT FOUND ADDRESS!!!!!",404));
    address && res.status(200).json({message:"DONE....",address});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
export{
  addToAddress,
  removeFromAddress,
  getAllAddress
};

