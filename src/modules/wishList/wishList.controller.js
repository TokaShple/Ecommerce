import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import { userModel } from "../../../database/models/user.model.js";
import AppError from "../../utlis/services/AppError.js";
import { productModel } from "../../../database/models/product.model.js";

//CRUD
//////   1-CREATE
const addToWishList =catchAsyncError(async(req,res,next)=>{
  try{
      let {product}=req.body;
      let userId=req.userId;
      let wishList= await userModel.findByIdAndUpdate(userId,{$addToSet:{wishList:product}},{new:true});
      let saveWishList= await wishList.save();
      saveWishList && res.status(201).json({message:"WISHLIST ADDED..........",saveWishList});
      !saveWishList && next (new AppError("WISHLIST NOT SAVED!!!!!!",400));
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   2-DELETE 
const removeFromWishList=catchAsyncError(async(req,res,next)=>{
  try{
      let {product}=req.body;
      let userId=req.userId;
      let wishList= await userModel.findOneAndUpdate(userId,{$pull:{wishList:product}},{new:true});
      wishList && res.status(201).json({message:"WISHLIST REMOVED..........",wishList});
      !wishList && next (new AppError("WISHLIST NOT REMOVED!!!!!!",400));
    
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   3-GET ALL
const getAllWishList=catchAsyncError(async(req,res,next)=>{
  try{
    let userId=req.userId;
    let wishList=await userModel.findById(userId).populate("wishList");
    !wishList && next(new AppError("NOT FOUND WISHLIST!!!!!",404));
    wishList && res.status(200).json({message:"DONE....",wishList});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
export{
  addToWishList,
  removeFromWishList,
  getAllWishList
};

