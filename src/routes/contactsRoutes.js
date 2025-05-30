import express from 'express';
import { getContacts, getContact } from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', getContacts);
router.get('/:contactId', getContact);

export default router;