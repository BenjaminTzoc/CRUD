const validateSchema = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success)
            return res.status(500).json({statusCode: 500, message: "Error de validación", error: result.error.flatten()});

        next();
    }
};

module.exports = validateSchema;