import { cartModel } from "../../../database/models/cart.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import AppError from "../../utlis/services/AppError.js";
import ApiFeatures from "../../utlis/services/APIFeatures.js";
import { productModel } from "../../../database/models/product.model.js";

function calcPrice(cart){
  let totalPrice=0;
  cart.cartItems.forEach((ele)=>{
    totalPrice += ele.quantity*ele.price;
  })
  cart.totalPrice=totalPrice;
}
//////// 1-CREATE CART
const createCart=catchAsyncError(async(req,res,next)=>{
  let product=await productModel.findById(req.body.product).select("price");
  !product && next(new AppError("PRODUCT NOT FOUND!!!!!",404));
  let isCartExist=await cartModel.findOne({user:req.userId});
  if(!isCartExist){
    let cart=new cartModel({
      user:req.userId,
      cartItems:[{product: req.body.product,
        quantity: req.body.quantity,
        price: product.price }]
    });
    calcPrice(cart);
    await cart.save();
    return res.status(201).json({message:"CART CREATED.....",cart});
  }
  let item=isCartExist.cartItems.find((ele)=>ele.product==req.body.product);
  if(item){
    item.quantity += 1;
  }else{
    isCartExist.cartItems.push({
      product: req.body.product,
      quantity: req.body.quantity,
      price: product.price
    });
  }
  calcPrice(isCartExist);
  await isCartExist.save();
  res.status(200).json({message:"Your Cart...",isCartExist});
});
///////////2-get cart
const getCart=catchAsyncError(async(req,res,next)=>{
  let cart = await cartModel.findOne({user:req.userId});
  res.status(200).json({message:"DONE....",cart});
})
///////////3-delete cart
const deleteCartItem=catchAsyncError(async(req,res,next)=>{
  let cart= await cartModel.findOneAndUpdate({user:req.userId},{$pull:{cartItems:{_id:req.params.id}}},{new:true});
  res.status(200).json({message:"Item Deleted...",cart});
})
/////////4-update cart
const updateCart=catchAsyncError(async(req,res,next)=>{
  let product=await productModel.findById(req.body.product).select("price");
  !product && next(new AppError("PRODUCT NOT FOUND!!!!!",404));
  let isCartExist=await cartModel.findOne({user:req.userId});
  let item=isCartExist.cartItems.find((ele)=>ele.product==req.body.product);
  !item&&next(new AppError("NO ITEMS FOUND!!!",404));
  if(item){
    item.quantity = req.body.quantity;
  }
  calcPrice(isCartExist);
  await isCartExist.save();
  res.status(200).json({message:"Your Cart...",isCartExist});
})
export{createCart,getCart,deleteCartItem,updateCart};