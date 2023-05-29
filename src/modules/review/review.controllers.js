import { reviewModel } from "../../../database/models/review.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import AppError from "../../utlis/services/AppError.js";
import deleteOne from "../../utlis/handlers/refactor.handler.js";
import ApiFeatures from "../../utlis/services/APIFeatures.js";
//CRUD
//////   1-CREATE
const createReview =catchAsyncError(async(req,res,next)=>{
  try{
    let {comment,product,user,rating}=req.body;
    let isExists=await reviewModel.findOne({user:req.body.user._id,product:req.body.product});
    if(isExists){
      return res.status(409).json({message:"REVIEW ALREADY EXISTS!!!!!"});
    }else{
      let review= new reviewModel({comment,product,user,rating});
      let saveReview= await review.save();
      saveReview && res.status(201).json({message:"REVIEW ADDED..........",saveReview});
      !saveReview && next (new AppError("REVIEW NOT SAVED!!!!!!",400));
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   2-READ(GET ALL)
const getallReview=catchAsyncError(async(req,res,next)=>{
  try{
    let apiFeatures=new ApiFeatures(reviewModel.find(),req.query).pagination().fields().sort().search();
    let review=await apiFeatures.mongooseQuery ;
    !review && next (new AppError("Not Found!!!!",404));
    review && res.status(200).json({message:"DONE...",page:apiFeatures.page,review});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   2.1-READ BY ID
const getReviewById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let review=await reviewModel.findById(id);
    !review && next (new AppError("Not Found!!!!",404));
    review && res.status(200).json({message:"DONE...",review});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   3-UPDATE BY Id
const updateReviewById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let {comment,rating}=req.body;
    let review=await reviewModel.findOneAndUpdate({_id:id,user:req.body.user._id},req.body,{new:true});
    !review && next (new AppError("Not Found!!!!",404));
    review && res.status(200).json({message:"DONE...",review});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   4-DELETE By Id
const deleteReviewById=deleteOne(reviewModel);
export{
  createReview,
  getallReview,
  getReviewById,
  updateReviewById,
  deleteReviewById
};