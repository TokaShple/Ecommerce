import { brandModel } from "../../../database/models/brand.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import slugify from "slugify";
import AppError from "../../utlis/services/AppError.js";
import deleteOne from "../../utlis/handlers/refactor.handler.js";
import ApiFeatures from "../../utlis/services/APIFeatures.js";
//CRUD
//////   1-CREATE
const createBrand =catchAsyncError(async(req,res,next)=>{
  try{
    req.body.slug=slugify(req.body.name);
    req.body.logo=req.file.filename;
    let {name}=req.body;
    let isExists=await brandModel.findOne({name});
    if(isExists){
      return res.status(400).json({message:"BRAND ALREADY EXISTS!!!!!"});
    }else{
      let brand= new brandModel(req.body);
      let saveBrand= await brand.save();
      saveBrand && res.status(201).json({message:"BRAND ADDED..........",saveBrand});
      !saveBrand && next (new AppError("BRAND NOT SAVED!!!!!!",400));
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   2-READ(GET ALL)
const getallBrand=catchAsyncError(async(req,res,next)=>{
  try{
    let apiFeatures=new ApiFeatures(brandModel.find(),req.query).pagination().fields().sort().search();
    let brand=await apiFeatures.mongooseQuery ;
    !brand && next (new AppError("Not Found!!!!",404));
    brand && res.status(200).json({message:"DONE...",page:apiFeatures.page,brand});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   2.1-READ BY ID
const getBrandById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let brand=await brandModel.findById(id);
    !brand && next (new AppError("Not Found!!!!",404));
    brand && res.status(200).json({message:"DONE...",brand});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   3-UPDATE BY Id
const updateBrandById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    req.body.slug=slugify(req.body.name);
    if(req.file)req.body.logo=req.file.filename;
    let brand=await brandModel.findByIdAndUpdate(id,req.body,{new:true});
    !brand && next (new AppError("Not Found!!!!",404));
    brand && res.status(200).json({message:"DONE...",brand});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   4-DELETE By Id
const deleteBrandById=deleteOne(brandModel);
export{
  createBrand,
  getallBrand,
  getBrandById,
  updateBrandById,
  deleteBrandById
};