import createError from "http-errors"
import * as contactsService from "../services/contact.js"

export const getAllContacts = async (req, res, next) => {
    try {
        // Sorgu parametrelerini al
        const { page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", type, isFavourite } = req.query

        // Servis katmanından sayfalandırma, sıralama ve filtreleme ile verileri al
        // Kullanıcı ID'sini de gönder
        const result = await contactsService.getAllContacts({
            page: Number(page),
            perPage: Number(perPage),
            sortBy,
            sortOrder,
            type,
            isFavourite,
            userId: req.user._id, // Kullanıcı ID'sini ekle
        })

        // Sayfalandırma bilgilerini hazırla
        const paginationData = {
            data: result.contacts,
            page: Number(page),
            perPage: Number(perPage),
            totalItems: result.totalItems,
            totalPages: result.totalPages,
            hasPreviousPage: Number(page) > 1,
            hasNextPage: Number(page) < result.totalPages,
        }

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data: paginationData,
        })
    } catch (error) {
        // Hata yönetimi - next middleware'ine hata gönder
        next(error);
    }
}

export const getContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params
        // Kullanıcı ID'sini de gönder
        const contact = await contactsService.getContactById(contactId, req.user._id)

        if (!contact) {
            return res.status(404).json({
                status: 404,
                message: "Contact not found",
                data: null
            });
        }

        res.json({
            status: 200,
            message: "Successfully fetched contact!",
            data: contact,
        })
    } catch (error) {
        // Hata yönetimi - next middleware'ine hata gönder
        next(error);
    }
}

export const createContact = async (req, res, next) => {
    try {
        const { name, phoneNumber, email, isFavourite, contactType } = req.body

        // Yeni contact oluştururken kullanıcı ID'sini de gönder
        const newContact = await contactsService.createContact({
            name,
            phoneNumber,
            email,
            isFavourite,
            contactType,
            owner: req.user._id, // Kullanıcı ID'sini ekle
        })

        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: newContact,
        })
    } catch (error) {
        // Hata yönetimi - next middleware'ine hata gönder
        next(error);
    }
}

export const updateContact = async (req, res, next) => {
    try {
        const { contactId } = req.params
        const { name, phoneNumber, email, isFavourite, contactType } = req.body

        // Güncelleme yaparken kullanıcı ID'sini de gönder
        const updatedContact = await contactsService.updateContact(
            contactId,
            {
                name,
                phoneNumber,
                email,
                isFavourite,
                contactType,
            },
            req.user._id,
        ) // Kullanıcı ID'sini ekle

        if (!updatedContact) {
            return res.status(404).json({
                status: 404,
                message: "Contact not found",
                data: null
            });
        }

        res.json({
            status: 200,
            message: "Successfully updated a contact!",
            data: updatedContact,
        })
    } catch (error) {
        // Hata yönetimi - next middleware'ine hata gönder
        next(error);
    }
}

export const deleteContact = async (req, res, next) => {
    try {
        const { contactId } = req.params

        // Silme işlemi yaparken kullanıcı ID'sini de gönder
        const deletedContact = await contactsService.deleteContact(contactId, req.user._id)

        if (!deletedContact) {
            return res.status(404).json({
                status: 404,
                message: "Contact not found",
                data: null
            });
        }

        // Başarılı silme işlemi için JSON yanıtı
        res.json({
            status: 200,
            message: "Successfully deleted a contact!",
            data: deletedContact
        });
    } catch (error) {
        // Hata yönetimi - next middleware'ine hata gönder
        next(error);
    }
}