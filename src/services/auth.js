import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';

// JWT için gizli anahtarlar
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key';

export const register = async ({ name, email, password }) => {
    // E-posta adresinin kullanımda olup olmadığını kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError(409, 'Email in use');
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });

    // Şifreyi çıkar
    const user = newUser.toObject();
    delete user.password;

    return user;
};

export const login = async ({ email, password }) => {
    // Kullanıcıyı e-posta adresine göre bul
    const user = await User.findOne({ email });
    if (!user) {
        throw createError(401, 'Email or password is wrong');
    }

    // Şifreyi doğrula
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createError(401, 'Email or password is wrong');
    }

    // Kullanıcının mevcut oturumunu sil (varsa)
    await Session.deleteMany({ userId: user._id });

    // Access token ve refresh token oluştur
    const accessToken = jwt.sign(
        { id: user._id },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    );

    // Token geçerlilik sürelerini hesapla
    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 gün

    // Yeni oturum oluştur
    await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil
    });

    // Şifreyi çıkar
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refresh = async (refreshToken) => {
    try {
        // Refresh token'ı doğrula
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        // Oturumu bul
        const session = await Session.findOne({ refreshToken });
        if (!session) {
            throw createError(401, 'Invalid refresh token');
        }

        // Refresh token'ın geçerlilik süresini kontrol et
        if (new Date() > session.refreshTokenValidUntil) {
            throw createError(401, 'Refresh token expired');
        }

        // Kullanıcıyı bul
        const user = await User.findById(decoded.id);
        if (!user) {
            throw createError(401, 'User not found');
        }

        // Eski oturumu sil
        await Session.deleteOne({ refreshToken });

        // Yeni token'lar oluştur
        const accessToken = jwt.sign(
            { id: user._id },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { id: user._id },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' }
        );

        // Token geçerlilik sürelerini hesapla
        const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika
        const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 gün

        // Yeni oturum oluştur
        await Session.create({
            userId: user._id,
            accessToken,
            refreshToken: newRefreshToken,
            accessTokenValidUntil,
            refreshTokenValidUntil
        });

        return { accessToken, newRefreshToken };
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            throw createError(401, 'Invalid refresh token');
        }
        throw error;
    }
};

export const logout = async (refreshToken) => {
    try {
        // Refresh token ile ilişkili oturumu bul ve sil
        const result = await Session.deleteOne({ refreshToken });

        // Oturum bulunamadıysa sessizce devam et (hata fırlatma)
        return { success: true };
    } catch (error) {
        throw error;
    }
};

// Yeni eklenen fonksiyon
export const getUserById = async (userId) => {
    try {
        // Kullanıcıyı ID'ye göre bul ve şifreyi hariç tut
        const user = await User.findById(userId).select("-password");

        if (!user) {
            throw createError(404, 'User not found');
        }

        return user;
    } catch (error) {
        throw error;
    }
};