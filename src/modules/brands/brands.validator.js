import Joi from "joi";
//1-CREATE VALIDATION
export const createBrandSchema=Joi.object({
  name:Joi.string().min(2).max(30).required()
});
//2-GET BY ID Validation
export const getBrandByIdSchema=Joi.object({
  id:Joi.string().hex().length(24).required()
});
//3-UPDATE 
export const updateBrandByIdSchema=Joi.object({
  name:Joi.string().min(2).max(30).required(),
  id:Joi.string().hex().length(24).required()
});
//3-DELETE
export const deleteBrandByIdSchema=Joi.object({
  id:Joi.string().hex().length(24).required()
});