import mongoose from "mongoose";
const subcategorySchema=mongoose.Schema({
  name:{
    type:String,
    unique:[true,"name is required!!!!!"],
    trim:true,
    required:true,
    minLength:[2,"too short category name!!!!!!"]
  },
  slug:{
    type:String,
    lowercase:true,
    required:true,
  },
  Image:String,
  category:{
    type:mongoose.Types.ObjectId,
    ref:"category"
  }
},{
  timestamps:true
})
export const subcategoryModel=mongoose.model("subcategory",subcategorySchema);