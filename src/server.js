import express from 'express';
import contactsRouter from './routes/contacts.js'; // veya './routes/contactsRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
    const app = express();
    const PORT = process.env.PORT || 3007;

    // Middleware
    app.use(express.json());

    // Routes
    app.use('/contacts', contactsRouter);

    // 404 handler
    app.use(notFoundHandler);

    // Error handler
    app.use(errorHandler);

    // Sunucuyu başlat
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    return app;
};