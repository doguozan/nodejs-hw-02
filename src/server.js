import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import contactsRoutes from './routes/contactsRoutes.js';

export const setupServer = () => {
    const app = express();
    const PORT = process.env.PORT || 3007;

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(pinoHttp());

    // Routes
    app.use('/contacts', contactsRoutes);

    // 404 handler for non-existent routes
    app.use((req, res) => {
        res.status(404).json({ message: 'Not found' });
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    return app;
};