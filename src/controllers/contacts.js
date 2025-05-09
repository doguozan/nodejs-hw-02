// src/controllers/contacts.js
import createError from 'http-errors';
import * as contactsService from '../services/contact.js';

export const getAllContacts = async (req, res) => {
    try {
        // Sorgu parametrelerini al
        const {
            page = 1,
            perPage = 10,
            sortBy = 'name',
            sortOrder = 'asc',
            type,
            isFavourite
        } = req.query;

        // Servis katmanından sayfalandırma, sıralama ve filtreleme ile verileri al
        const result = await contactsService.getAllContacts({
            page: Number(page),
            perPage: Number(perPage),
            sortBy,
            sortOrder,
            type,
            isFavourite
        });

        // Sayfalandırma bilgilerini hazırla
        const paginationData = {
            data: result.contacts,
            page: Number(page),
            perPage: Number(perPage),
            totalItems: result.totalItems,
            totalPages: result.totalPages,
            hasPreviousPage: Number(page) > 1,
            hasNextPage: Number(page) < result.totalPages,
        };

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data: paginationData,
        });
    } catch (error) {
        // Hata yönetimi
        if (error.status) {
            throw error;
        }
        throw createError(500, error.message);
    }
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

    // Artık bu kontrolleri Joi şeması yapacak, burayı kaldırabilirsiniz
    // if (!name || !phoneNumber || !contactType) {
    //     throw createError(400, "Missing required fields: name, phoneNumber, contactType");
    // }

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

    // Artık bu kontrolleri Joi şeması yapacak, burayı kaldırabilirsiniz
    // if (!name && !phoneNumber && !email && isFavourite === undefined && !contactType) {
    //     throw createError(400, "At least one field is required");
    // }

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