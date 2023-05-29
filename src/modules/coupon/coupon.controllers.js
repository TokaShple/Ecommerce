import { couponModel } from "../../../database/models/coupon.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import AppError from "../../utlis/services/AppError.js";
import deleteOne from "../../utlis/handlers/refactor.handler.js";
import ApiFeatures from "../../utlis/services/APIFeatures.js";
import qrcode from "qrcode";
import moment from "moment";
//CRUD
//////   1-CREATE
const createCoupon =catchAsyncError(async(req,res,next)=>{
  try{
    let {code,discount,expire}=req.body;
    expire = moment(expire, 'DD/MM/YYYY').toDate();
    let coupon= new couponModel({code,discount,expire});
    let saveCoupon= await coupon.save();
    saveCoupon && res.status(201).json({message:"REVIEW ADDED..........",saveCoupon});
    !saveCoupon && next (new AppError("REVIEW NOT SAVED!!!!!!",400));
    }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   2-READ(GET ALL)
const getallCoupon=catchAsyncError(async(req,res,next)=>{
  try{
    let apiFeatures=new ApiFeatures(couponModel.find(),req.query).pagination().fields().sort().search();
    let coupon=await apiFeatures.mongooseQuery ;
    !coupon && next (new AppError("Not Found!!!!",404));
    coupon && res.status(200).json({message:"DONE...",page:apiFeatures.page,coupon});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   2.1-READ BY ID
const getCouponById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let coupon=await couponModel.findById(id);
    let url = await qrcode.toDataURL(coupon.code); 
    !coupon && next (new AppError("Not Found!!!!",404));
    coupon && res.status(200).json({message:"DONE...",coupon,url});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   3-UPDATE BY Id
const updateCouponById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let {code,discount,expire}=req.body;
    expire = moment(expire, 'DD/MM/YYYY').toDate();
    let coupon=await couponModel.findOneAndUpdate({_id:id,user:req.body.userId},req.body,{new:true});
    !coupon && next (new AppError("Not Found!!!!",404));
    coupon && res.status(200).json({message:"DONE...",coupon});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   4-DELETE By Id
const deleteCouponById=deleteOne(couponModel);
export{
  createCoupon,
  getallCoupon,
  getCouponById,
  updateCouponById,
  deleteCouponById
};