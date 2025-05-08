import Contact from '../db/models/Contact.js';

export const getAllContacts = async () => {
    try {
        console.log('Tüm iletişimler getiriliyor...');
        const contacts = await Contact.find();
        console.log('Bulunan iletişimler:', contacts);
        return contacts;
    } catch (error) {
        console.error('İletişimler getirilirken hata oluştu:', error);
        throw error;
    }
};

export const getContactById = async (contactId) => {
    try {
        console.log(`ID'si ${contactId} olan iletişim getiriliyor...`);
        const contact = await Contact.findById(contactId);
        console.log('Bulunan iletişim:', contact);
        return contact;
    } catch (error) {
        console.error('İletişim getirilirken hata oluştu:', error);
        throw error;
    }
};

export const createContact = async (contactData) => {
    try {
        console.log('Yeni iletişim oluşturuluyor:', contactData);
        const newContact = await Contact.create(contactData);
        console.log('Oluşturulan iletişim:', newContact);
        return newContact;
    } catch (error) {
        console.error('İletişim oluşturulurken hata oluştu:', error);
        throw error;
    }
};

export const updateContact = async (contactId, contactData) => {
    try {
        console.log(`ID'si ${contactId} olan iletişim güncelleniyor:`, contactData);
        const updatedContact = await Contact.findByIdAndUpdate(
            contactId,
            { $set: contactData },
            { new: true }
        );
        console.log('Güncellenen iletişim:', updatedContact);
        return updatedContact;
    } catch (error) {
        console.error('İletişim güncellenirken hata oluştu:', error);
        throw error;
    }
};

export const deleteContact = async (contactId) => {
    try {
        console.log(`ID'si ${contactId} olan iletişim siliniyor...`);
        const deletedContact = await Contact.findByIdAndDelete(contactId);
        console.log('Silinen iletişim:', deletedContact);
        return deletedContact;
    } catch (error) {
        console.error('İletişim silinirken hata oluştu:', error);
        throw error;
    }
};