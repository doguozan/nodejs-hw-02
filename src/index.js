import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

// Uygulamayı başlat
const startApp = async () => {
    try {
        // Önce MongoDB bağlantısını kur
        await initMongoConnection();
        // Sonra sunucuyu başlat
        setupServer();
    } catch (error) {
        console.error('Uygulama başlatılamadı:', error);
        process.exit(1);
    }
};

startApp();