import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        required: true,
        default: 'personal',
    },
}, { timestamps: true });

// Model oluşturulduğunda bir log ekleyelim
const Contact = mongoose.model('Contact', contactSchema, 'contacts');
console.log('Contact modeli oluşturuldu, koleksiyon adı: contacts');

// Mongoose'un query'lerini debug etmek için
if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
}

export default Contact;