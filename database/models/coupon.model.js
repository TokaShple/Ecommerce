import mongoose from "mongoose";

const couponSchema=mongoose.Schema({
  code:{
    type:String,
    trim:true,
    required:[true,"COUPON REQUIRD"],
    unique:true
  },
  discount:{
    type:Number,
    min:0,
    required:[true,"DISCOUNT REQUIRED"]
  },
  expire:{
    type:Date,
    required:[true,"EXPIRE DATE REQUIRD"]
  }
},{
  timestamps:true
});
export const couponModel = mongoose.model("coupon",couponSchema);