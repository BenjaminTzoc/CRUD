const { z } = require('zod');

const loginSchema = z.object({
    username: z.string().min(3, "El nombre de usuario es demasiado corto"),
    password: z.string().min(8, "La contraseña debe contener al menos 8 caracteres"),
});

const passwordSchema = z.string()
    .min(8, "La contraseña debe contener al menos 8 caracteres")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(/[@$!%*?&]/, "La contraseña debe contener al menos un caracter especial (@$!%*?&)");

const userSchema = z.object({
    username: z.string().min(3, "El nombre de usuario es demasiado corto.").max(20, "El nombre de usuario es demasiado largo"),
    email: z.string().email("Email inválido"),
    password: passwordSchema,
    roleId: z.number().int().positive("El rol es inválido")
});

const updateUserSchema = userSchema.partial();

module.exports = { userSchema, updateUserSchema, loginSchema }