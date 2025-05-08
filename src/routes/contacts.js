import express from 'express';
import * as contactsController from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

// GET tüm iletişimleri getir
router.get('/', ctrlWrapper(contactsController.getAllContacts));

// GET belirli bir iletişimi getir
router.get('/:contactId', ctrlWrapper(contactsController.getContactById));

// POST yeni iletişim oluştur
router.post('/', ctrlWrapper(contactsController.createContact));

// PATCH iletişim güncelle
router.patch('/:contactId', ctrlWrapper(contactsController.updateContact));

// DELETE iletişim sil
router.delete('/:contactId', ctrlWrapper(contactsController.deleteContact));

export default router;