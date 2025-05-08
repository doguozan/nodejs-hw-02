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