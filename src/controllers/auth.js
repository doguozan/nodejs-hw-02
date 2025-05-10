import createError from 'http-errors';
import * as authService from '../services/auth.js';

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await authService.register({ name, email, password });

        res.status(201).json({
            status: 201,
            message: "Successfully registered a user!",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { user, accessToken, refreshToken } = await authService.login({ email, password });

        // Refresh token'ı cookie olarak ayarla
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        res.json({
            status: 200,
            message: "Successfully logged in an user!",
            data: {
                accessToken
            }
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            throw createError(401, 'Refresh token not found');
        }

        const { accessToken, newRefreshToken } = await authService.refresh(refreshToken);

        // Yeni refresh token'ı cookie olarak ayarla
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        res.json({
            status: 200,
            message: "Successfully refreshed a session!",
            data: {
                accessToken
            }
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            // Oturumu veritabanından sil
            await authService.logout(refreshToken);
        }

        // Refresh token cookie'sini temizle
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        res.json({
            status: 200,
            message: "Successfully logged out!",
            data: null
        });
    } catch (error) {
        next(error);
    }
};

// Yeni eklenen fonksiyon
export const getCurrent = async (req, res, next) => {
    try {
        // req.user, authenticate middleware tarafından ekleniyor
        const { _id } = req.user;

        // Kullanıcıyı veritabanından al, şifreyi hariç tut
        const user = await authService.getUserById(_id);

        if (!user) {
            throw createError(404, 'User not found');
        }

        res.json({
            status: 200,
            message: "Successfully fetched current user!",
            data: user
        });
    } catch (error) {
        next(error);
    }
};