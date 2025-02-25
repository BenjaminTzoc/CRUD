const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { username, email, password, roleId } = req.body;

        const existingUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUsername)
            res.status(400).json({ statusCode: 400, message: "El nombre de usuario ya se encuentra en uso" });

        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail)
            res.status(400).json({ statusCode: 400, message: "El email ya se encuentra en uso" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword, roleId },
            select: { id: true, username: true, email: true, role: { select: { name: true } } },
        });

        res.status(201).json({ statusCode: 201, message: "Usuario registrado exitosamente", user });
    } catch (error) {
        console.error("Error al registrar el usuario: ", error);
        res.status(200).json({ statusCode: 200, message: "Error al registrar el usuario" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const findedUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email: username }] },
        });

        if (!findedUser) 
            return res.status(404).json({ statusCode: 404, message: "Usuario no encontrado" });

        const validPassword = await bcrypt.compare(password, findedUser.password);

        if (!validPassword) 
            return res.status(401).json({ statusCode: 401, message: "Credenciales inválidas" });

        const token = jwt.sign(
          { userId: findedUser.id, roleId: findedUser.roleId },
          process.env.JWT_SECRET,
          { expiresIn: "10m" }
        );

        res.status(200).json({ statusCode: 200, message: "Inicio de sesión exitoso", token });
    } catch (error) {
        console.error("Error al iniciar sesión: ", error);
        res.status(200).json({ statusCode: 200, message: "Error al iniciar sesión" });
    }
};

module.exports = { register, login };