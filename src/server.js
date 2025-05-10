import mongoose from 'mongoose';
import { app } from './app.js';

export const setupServer = async (port) => {
    const { DB_HOST } = process.env;

    try {
        await mongoose.connect(DB_HOST);
        console.log('Database connection successful');

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        return app;
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};