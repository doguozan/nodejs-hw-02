import express from "express";
import * as contactsController from "../controllers/contacts.js";
import { validateBody, isValidId } from "../middlewares/validation.js";
import { createContactSchema, updateContactSchema } from "../schemas/contact.js";

const router = express.Router();

// Tüm iletişimleri getir
router.get("/", contactsController.getAllContacts);

// ID'ye göre iletişim getir
router.get("/:contactId", isValidId, contactsController.getContactById);

// Yeni iletişim oluştur (doğrulama ile)
router.post("/", validateBody(createContactSchema), contactsController.createContact);

// İletişimi güncelle (doğrulama ile)
router.patch("/:contactId", isValidId, validateBody(updateContactSchema), contactsController.updateContact);

// İletişimi sil
router.delete("/:contactId", isValidId, contactsController.deleteContact);

export default router;