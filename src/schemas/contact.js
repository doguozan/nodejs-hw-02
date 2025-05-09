import Joi from "joi";

// Contact oluşturma için doğrulama şeması
export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().allow(null, ""),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("work", "home", "personal"),
});

// Contact güncelleme için doğrulama şeması
export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().email().allow(null, ""),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("work", "home", "personal"),
}).min(1); // En az bir alan güncellenmelidir