import { subcategoryModel } from "../../../database/models/subcategory.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import slugify from "slugify";
import AppError from "../../utlis/services/AppError.js";
import deleteOne from "../../utlis/handlers/refactor.handler.js";
//CRUD
//////   1-CREATE
const createSubCategory =catchAsyncError(async(req,res,next)=>{
  try{
    let {name,categoryId}=req.body;
    let isExists=await subcategoryModel.findOne({name});
    if(isExists){
      return res.status(400).json({message:"SUBCATEGORY ALREADY EXISTS!!!!!"});
    }else{
      let subcategory= new subcategoryModel({name,slug:slugify(name),category:categoryId});
      let saveSubCategory= await subcategory.save();
      saveSubCategory && res.status(201).json({message:"SUBCATEGORY ADDED..........",saveSubCategory});
      !saveSubCategory && next (new AppError("SUBCATEGORY NOT SAVED!!!!!!",400));
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   2-READ(GET ALL)
const getallSubCategory=catchAsyncError(async(req,res,next)=>{
  try{
    //merge
    //begin...
    let filters={};
    if(req.params && req.params.id){
      filters={
        category:req.params.id
      }
    }
    //end of merge....
    let subcategory=await subcategoryModel.find(filters);
    !subcategory && next (new AppError("Not Found!!!!",404));
    subcategory && res.status(200).json({message:"DONE...",subcategory});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   2.1-READ BY ID (GET BY ID)
const getSubCategoryById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let subcategory=await subcategoryModel.findById(id);
    !subcategory && next (new AppError("Not Found!!!!",404));
    subcategory && res.status(200).json({message:"DONE...",subcategory});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   3-UPDATE BY Id
const updateSubCategoryById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let subcategoryExist= await subcategoryModel.findById(id);
    if(!subcategoryExist){
      return next (new AppError("ID NOT FOUND!!!!!!!!",404));
    }else{
      let {name,categoryId}=req.body;
      let subcategory=await subcategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name),category:categoryId},{new:true});
      !subcategory && next (new AppError("Not UPDATED!!!!",400));
      subcategory && res.status(200).json({message:"DONE SUBCATEGORY UPDATED...",subcategory});
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   4-DELETE By Id
const deleteSubCategoryById=deleteOne(subcategoryModel);
export{
  createSubCategory,
  getallSubCategory,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById
};