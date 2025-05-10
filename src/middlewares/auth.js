import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';

// JWT için gizli anahtar
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key';

export const authenticate = async (req, res, next) => {
    try {
        // Authorization header'ını kontrol et
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError(401, 'No token provided');
        }

        // Token'ı çıkar
        const token = authHeader.split(' ')[1];

        try {
            // Token'ı doğrula
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

            // Oturumu bul
            const session = await Session.findOne({
                accessToken: token,
                accessTokenValidUntil: { $gt: new Date() }
            });

            if (!session) {
                throw createError(401, 'Invalid or expired token');
            }

            // Kullanıcıyı bul
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                throw createError(401, 'User not found');
            }

            // Kullanıcı bilgisini request nesnesine ekle
            req.user = user;
            req.session = session;

            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                throw createError(401, 'Invalid or expired token');
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
};