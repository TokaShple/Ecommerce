import { orderModel } from "../../../database/models/order.model.js";
import { productModel } from "../../../database/models/product.model.js";
import { cartModel } from "../../../database/models/cart.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import AppError from "../../utlis/services/AppError.js";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51NHCWaHCjchNe1uLdPwRgf8TAZCotN05E2etXzo8Rwo50hHCcFlM9mMrCxWitGBJ043lCGuNOyfEn6qMH4H1rFPK002S1Svqpq');
//////////////////////////////////////////////////////////1-CREATE ORDER
const createCacheOrder=catchAsyncError(async(req,res,next)=>{
  try{
    //1-cart ..... id cart params
    /*let cart=await cartModel.findById(req.params._id);
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }*/
    const cart = await cartModel.findOne({ user: req.userId });
    const cartId = req.params._id;
    //2-total price
    let totalPrice=cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalPrice;
    //3-create order 
    let order=new orderModel({user:req.userId,cartItems:cart.cartItems,totalOrderPrice:totalPrice,shippingAdderss:req.body.shippingAdderss});
    //4-update sold and quantity
    if(order){
      let options=cart.cartItems.map((item)=>({
        updateOne:{
          filter:{_id:item.product},
          update:{$inc:{quantity:-item.quantity,sold:item.quantity}}
        }
      }))
      await productModel.bulkWrite(options);
      await order.save();
    }else{
      return next(new AppError("Can't save order",409));
    }
    //5-remove cart
    await cartModel.findByIdAndDelete(cartId);
    res.json({message:"DONE",order});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
  
  
//////////////////////////////////////////////////////////2-GET ORDER
const getOrder=catchAsyncError(async(req,res,next)=>{
  try{
    let order=await orderModel.findOne({user:userId}).populate("cartItems.product");
    res.status(200).json({message:"DONE...",order});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////////////////////////////////////////////////////////3-GET ALL ORDER
const getAllOrder=catchAsyncError(async(req,res,next)=>{
  try{
    let order=await orderModel.find({user:userId});
    res.status(200).json({message:"DONE...",order});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////////////////////////////////////////////////////////4-Create Online Order
const onlinePayment=catchAsyncError(async(req,res,next)=>{
  try{
    //1-cart ..... id cart params
    const cart = await cartModel.findOne({ user: req.userId });
    const cartId = req.params._id;
    //2-total price
    let totalPrice=cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalPrice;
    //STRIPE
    let session=await stripe.checkout.sessions.create({
      line_items:[{
        price_data:{
          currency:"egp",
          unit_amount:totalPrice*100,
          product_data:{
            name:req.user ? req.user.name : '',
          },
        },
        quantity:1,
      }],
      mode:"payment",
      success_url:"https://route-comm.netlify.app/#/",
      cancel_url:"https://route-comm.netlify.app/#/cart",
      customer_email: req.user ? req.user.email : '',
      client_reference_id:req.params.id,
      metadata:req.body.shippingAdderss,
    });
    res.status(200).json({message:"DONE...",session});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})

export{createCacheOrder,getOrder,getAllOrder,onlinePayment}