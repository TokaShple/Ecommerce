import Joi from "joi";
//1-CREATE VALIDATION
export const createProductSchema=Joi.object({
  name:Joi.string().min(2).max(1000).required(),
  description:Joi.string().min(2).max(5000).required(),
  price:Joi.number().required(),
  quantity:Joi.number().required(),
  categoryId:Joi.string().hex().length(24).required(),
  subcategoryId:Joi.string().hex().length(24).required(),
  brandId:Joi.string().hex().length(24).required()
});
//2-GET BY ID Validation
export const getProductByIdSchema=Joi.object({
  id:Joi.string().hex().length(24).required()
});
//3-UPDATE 
export const updateProductByIdSchema=Joi.object({
  name:Joi.string().min(2).max(1000).required(),
  id:Joi.string().hex().length(24).required(),
  description:Joi.string().min(2).max(5000).required(),
  price:Joi.number().required(),
  quantity:Joi.number().required(),
  categoryId:Joi.string().hex().length(24).required(),
  subcategoryId:Joi.string().hex().length(24).required(),
  brandId:Joi.string().hex().length(24).required()
});
//3-DELETE
export const deleteProductByIdSchema=Joi.object({
  id:Joi.string().hex().length(24).required()
});