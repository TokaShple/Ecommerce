import { productModel } from "../../../database/models/product.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import slugify from "slugify";
import AppError from "../../utlis/services/AppError.js";
import deleteOne from "../../utlis/handlers/refactor.handler.js";
import ApiFeatures from "../../utlis/services/APIFeatures.js";
//CRUD
//////   1-CREATE
const createProduct =catchAsyncError(async(req,res,next)=>{
  try{
    req.body.slug=slugify(req.body.name);
    req.body.imgCover=req.files.imgCover[0].filename;
    req.body.images=req.files.images.map(ele => ele.filename);
    req.body.category=req.body.categoryId;
    req.body.subcategory=req.body.subcategoryId;
    req.body.brand=req.body.brandId;
    let {price,description,quantity}=req.body;
    let product= new productModel(req.body);
    let saveProduct= await product.save();
    saveProduct && res.status(201).json({message:"PRODUCT ADDED..........",saveProduct});
    !saveProduct && next (new AppError("PRODUCT NOT SAVED!!!!!!",400));
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   2-READ(GET ALL)
const getallProducts=catchAsyncError(async(req,res,next)=>{
  try{
    let apiFeatures=new ApiFeatures(productModel.find(),req.query).pagination().fields().sort().search();
    let product=await apiFeatures.mongooseQuery ;
    !product && next (new AppError("Not Found!!!!",404));
    product && res.status(200).json({message:"DONE...",page:apiFeatures.page,product});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   2.1-READ BY ID (GET BY ID)
const getProductById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let product=await productModel.findById(id);
    !product && next (new AppError("Not Found!!!!",404));
    product && res.status(200).json({message:"DONE...",product});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   3-UPDATE BY Id
const updateProductById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let productExist= await productModel.findById(id);
    if(!productExist){
      return next (new AppError("ID NOT FOUND!!!!!!!!",404));
    }else{
      let {name,categoryId,subcategoryId,brandId,price,description,quantity}=req.body;
      let product=await productModel.findByIdAndUpdate(id,{name,slug:slugify(name),category:categoryId,subcategory:subcategoryId, brand:brandId,price,description,quantity},{new:true});
      !product && next (new AppError("Not UPDATED!!!!",400));
      product && res.status(200).json({message:"DONE SUBCATEGORY UPDATED...",product});
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   4-DELETE By Id
const deleteProductById=deleteOne(productModel);
export{
  createProduct,
  getallProducts,
  getProductById,
  updateProductById,
  deleteProductById
};
