import { isValidObjectId } from 'mongoose';

// Doğrulama şemasını argüman olarak alacak ve isteğin body'sinin doğrulaması için middleware döndürecek
export const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: 400,
                message: error.details[0].message,
                data: null
            });
        }

        next();
    };
};

// ID'nin geçerliliğini kontrol etmek için middleware
export const isValidId = (req, res, next) => {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid contact ID format',
            data: null
        });
    }

    next();
};