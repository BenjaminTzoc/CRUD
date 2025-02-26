const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;
        const userId = req.user.userId;
        const roleId = req.user.roleId;

        if (roleId !== 1)
            return res.status(403).json({ statusCode: 403, message: "Acceso denegado" });

        const product = await prisma.product.create({ data: { name, price, userId } });

        res.status(201).json({ statusCode: 201, message: "Producto registrado exitosamente", product });
    } catch (error) {
        console.error("Error al registrar el producto: ", error);
        res.status(200).json({ statusCode: 200, message: "Error al registrar el producto" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, status } = req.body;
        const roleId = req.user.roleId;

        if (roleId !== 1)
            return res.status(403).json({ statusCode: 403, message: "Acceso denegado" });

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { name, price, status },
        });

        res.status(200).json({ statusCode: 200, message: "Producto actualizado exitosamente", product });
    } catch (error) {
        console.error("Error al actualizar el producto: ", error);
        res.status(200).json({ statusCode: 200, message: "Error al actualizar el producto" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const roleId = req.user.roleId;

        if (roleId !== 1)
            return res.status(403).json({ statusCode: 403, message: "Acceso denegado" });

        const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });

        if (!product.status)
            return res.status(400).json({ statusCode: 400, message: "El producto ya se encuentra desactivado" });

        await prisma.product.update({
            where: { id: parseInt(id) },
            data: { status: false },
        });

        res.status(200).json({ statusCode: 200, message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el producto: ", error);
        res.status(200).json({ statusCode: 200, message: "Error al eliminar el producto" });
    }
};

const getProducts = async (req, res) => {
    try {
        const roleId = req.user.roleId;
        const filters = {};

        if (roleId !== 1)
            filters.status = true;

        const products = await prisma.product.findMany({ 
            where: filters,
            select: { id: true, name: true, price: true, status: true, user: { select: { id: true, username: true } } },
        });

        res.status(200).json({ statusCode: 200, message: "Productos obtenidos exitosamente", products });
    } catch (error) {
        console.error("Error al obtener los productos: ", error);
        res.status(200).json({ statusCode: 200, message: "Error al obtener los productos" });
    }
}

module.exports = { createProduct, updateProduct, deleteProduct, getProducts };