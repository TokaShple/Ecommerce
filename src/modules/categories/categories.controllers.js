import { categoryModel } from "../../../database/models/category.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import slugify from "slugify";
import AppError from "../../utlis/services/AppError.js";
import deleteOne from "../../utlis/handlers/refactor.handler.js";
import ApiFeatures from "../../utlis/services/APIFeatures.js";
//CRUD
//////   1-CREATE
const createCategory =catchAsyncError(async(req,res,next)=>{
  try{
    req.body.slug=slugify(req.body.name);
    req.body.image=req.file.filename;
    let {name}=req.body;
    let isExists=await categoryModel.findOne({name});
    if(isExists){
      return res.status(400).json({message:"CATEGORY ALREADY EXISTS!!!!!"});
    }else{
      let category= new categoryModel(req.body);
      let saveCategory= await category.save();
      saveCategory && res.status(201).json({message:"CATEGORY ADDED..........",saveCategory});
      !saveCategory && next (new AppError("CATEGORY NOT SAVED!!!!!!",400));
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   2-READ(GET ALL)
const getallCategory=catchAsyncError(async(req,res,next)=>{
  try{
    let apiFeatures=new ApiFeatures(categoryModel.find(),req.query).pagination().fields().sort().search();
    let category=await apiFeatures.mongooseQuery ;
    !category && next (new AppError("Not Found!!!!",404));
    category && res.status(200).json({message:"DONE...",page:apiFeatures.page,category});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   2.1-READ BY ID
const getCategoryById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let category=await categoryModel.findById(id);
    !category && next (new AppError("Not Found!!!!",404));
    category && res.status(200).json({message:"DONE...",category});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   3-UPDATE BY Id
const updateCategoryById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let {name}=req.body;
    let category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
    !category && next (new AppError("Not Found!!!!",404));
    category && res.status(200).json({message:"DONE...",category});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   4-DELETE By Id
const deleteCategoryById=deleteOne(categoryModel);
export{
  createCategory,
  getallCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
};