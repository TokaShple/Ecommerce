import { userModel } from "../../../database/models/user.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import AppError from "../../utlis/services/AppError.js";
import deleteOne from "../../utlis/handlers/refactor.handler.js";
import ApiFeatures from "../../utlis/services/APIFeatures.js";
import bcrypt from "bcrypt";
//CRUD
//////   1-CREATE
const createUser =catchAsyncError(async(req,res,next)=>{
  try{
    let {name,email,password,phone}=req.body;
    let isExists=await userModel.findOne({email});
    if(isExists){
      return res.status(400).json({message:"USER ALREADY EXISTS!!!!!"});
    }else{
      let user= new userModel({name,email,password,phone});
      let saveUser= await user.save();
      saveUser && res.status(201).json({message:"USER ADDED..........",saveUser});
      !saveUser && next (new AppError("USER NOT SAVED!!!!!!",400));
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   2-READ(GET ALL)
const getallUsers=catchAsyncError(async(req,res,next)=>{
  try{
    let apiFeatures=new ApiFeatures(userModel.find(),req.query).pagination().fields().sort().search();
    let user=await apiFeatures.mongooseQuery ;
    !user && next (new AppError("Not Found!!!!",404));
    user && res.status(200).json({message:"DONE...",page:apiFeatures.page,user});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   2.1-READ BY ID
const getUserById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let user=await userModel.findById(id);
    !user && next (new AppError("Not Found!!!!",404));
    user && res.status(200).json({message:"DONE...",user});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   3-UPDATE BY Id
const updateUserById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let {name,email,password,phone}=req.body;
    let user=await userModel.findByIdAndUpdate(id,{name,email,password,phone},{new:true});
    !user && next (new AppError("Not Found!!!!",404));
    user && res.status(200).json({message:"DONE...",user});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   4-DELETE By Id
const deleteUserById=deleteOne(userModel);
//////   5-CHANGE PASSWORD
/*const changePassword=catchAsyncError(async(req,res,next)=>{
  let {id}=req.params;
  //let {password}=req.body;
  req.body.changePasswordAt=Date.now();
  let results=await userModel.findOneAndUpdate({_id:id},req.body,{new:true});
  !results && next(new AppError("not found user",404));
  results && res.status(200).json({message:"Done",results})
})*/
const changePassword = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;
  const salt = bcrypt.genSaltSync(7);
  const hashedPassword = bcrypt.hashSync(password, salt);
  req.body.changePasswordAt = Date.now();
  const updatedUser = await userModel.findOneAndUpdate(
    { _id: id },
    { password: hashedPassword },
    { new: true }
  );
  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ message: "Password updated successfully", user: updatedUser });
});

export{
  createUser,
  getallUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  changePassword
};