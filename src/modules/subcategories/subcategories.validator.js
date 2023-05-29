import Joi from "joi";
//1-CREATE VALIDATION
export const createSubcategorySchema=Joi.object({
  name:Joi.string().min(2).max(30).required(),
  categoryId:Joi.string().hex().length(24).required()
});
//2-GET BY ID Validation
export const getSubcategoryByIdSchema=Joi.object({
  id:Joi.string().hex().length(24).required()
})
//3-UPDATE 
export const updatesubcategoryByIdSchema=Joi.object({
  name:Joi.string().min(2).max(30).required(),
  id:Joi.string().hex().length(24).required(),
  categoryId:Joi.string().hex().length(24).required()
})
//3-DELETE
export const deleteSubcategoryByIdSchema=Joi.object({
  id:Joi.string().hex().length(24).required()
})