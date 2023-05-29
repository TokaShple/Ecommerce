import mongoose from "mongoose";
const productSchema=mongoose.Schema({
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
  price:{
    type:Number,
    required:[true,"product price required!!!!!"],
    min:0
  },
  ratingAvg:{
    type:Number,
    min:[1,"rating average must be greater than 1!!!!!!"],
    max:[5,"rating average must be less than 5!!!!!!"]
  },
  ratingCount:{
    type:Number,
    default:0,
    min:0
  },
  description:{
    type:String,
    trim:true,
    required:[true,"product description required!!!"],
    minLength:[5,"too short product description!!!!!!"],
    maxLength:[3000,"too long product description!!!!!!"]
  },
  quantity:{
    type:Number,
    default:0,
    min:0,
    required:[true,"product quantity required!!!!!!"]
  },
  sold:{
    type:Number,
    default:0,
    min:0
  },
  imgCover:String,
  images:[String],
  category:{
    type:mongoose.Types.ObjectId,
    ref:"category",
    required:[true,"product category required!!!!!"]
  },
  subcategory:{
    type:mongoose.Types.ObjectId,
    ref:"subcategory",
    required:[true,"product category required!!!!!"]
  },
  brand:{
    type:mongoose.Types.ObjectId,
    ref:"brand",
    required:[true,"product brand required!!!!!"]
  }
},{
  timestamps:true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})
productSchema.virtual("myReview",{
  ref:"review",
  localField:"_id",
  foreignField:"product"
});
productSchema.pre(/^find/,function(){
  this.populate("myReview")
});
productSchema.post('init',(doc)=>{
  //console.log(doc,"from doc");
  doc.imgCover=process.env.BASE_URL + "product/"+doc.imgCover;
  if(doc.images){
    doc.images=doc.images.map((path)=>
      process.env.BASE_URL + "product/" + path)
  }
})
export const productModel=mongoose.model("product",productSchema);
