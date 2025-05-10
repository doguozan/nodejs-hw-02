import createError from 'http-errors';

export const getCurrentUser = async (req, res, next) => {
    try {
        res.json({
            status: 200,
            message: "Successfully retrieved user profile!",
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};