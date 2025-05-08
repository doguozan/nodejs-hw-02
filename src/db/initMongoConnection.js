import mongoose from 'mongoose';

export const initMongoConnection = async () => {
    try {

        const connectionString = "mongodb+srv://doguozan:Cerenozan230824@cluster0.ebqrhbt.mongodb.net/contacts-db?retryWrites=true&w=majority";

        await mongoose.connect(connectionString);
        console.log('Mongo connection successfully established!');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Koleksiyonlar:', collections.map(c => c.name));


        if (collections.some(c => c.name === 'contacts')) {
            const contactsCollection = db.collection('contacts');
            const contacts = await contactsCollection.find({}).toArray();
            console.log('İletişim sayısı:', contacts.length);
            console.log('İletişimler:', contacts);
        } else {
            console.log('contacts koleksiyonu bulunamadı!');
        }
    } catch (error) {
        console.error('MongoDB bağlantısı kurulamadı:', error);
        throw error;
    }
};