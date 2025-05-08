import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
    const contacts = await contactsService.getAllContacts();
    res.json({
        status: 200,
        message: "Successfully fetched all contacts!",
        data: contacts
    });
};

export const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId);

    if (!contact) {
        throw createError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: "Successfully fetched contact!",
        data: contact
    });
};

export const createContact = async (req, res) => {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // Zorunlu alanları kontrol et
    if (!name || !phoneNumber || !contactType) {
        throw createError(400, "Missing required fields: name, phoneNumber, contactType");
    }

    const newContact = await contactsService.createContact({
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType
    });

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: newContact
    });
};

export const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // En az bir alan olmalı
    if (!name && !phoneNumber && !email && isFavourite === undefined && !contactType) {
        throw createError(400, "At least one field is required");
    }

    const updatedContact = await contactsService.updateContact(contactId, {
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType
    });

    if (!updatedContact) {
        throw createError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: updatedContact
    });
};

export const deleteContact = async (req, res) => {
    const { contactId } = req.params;

    const deletedContact = await contactsService.deleteContact(contactId);

    if (!deletedContact) {
        throw createError(404, "Contact not found");
    }

    // 204 No Content yanıtı, gövde olmadan
    res.status(204).send();
};