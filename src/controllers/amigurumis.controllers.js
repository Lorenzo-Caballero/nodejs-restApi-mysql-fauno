import { pool } from "../db.js";
import sharp from 'sharp';

export const createamigurumis = async (req, res) => {
    try {
        const { name, price, image } = req.body;
        if (!name || !price || !image) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios!"
            });
        }

        // Redimensionar y comprimir la imagen
        const resizedImageBuffer = await sharp(image.buffer) // image.buffer es el buffer de la imagen
            .resize({ width: 200 }) // Redimensiona la imagen al ancho máximo de 200 píxeles
            .toBuffer(); // Convierte la imagen a un buffer

        // Guardar la imagen en la base de datos
        const [row] = await pool.query("INSERT INTO amigurumis (name , price,image) VALUES (?, ?, ?)",
            [name, price, resizedImageBuffer]);

        res.json({
            id: row.insertId,
            name,
            price,
            image: resizedImageBuffer, // Aquí podrías guardar la imagen como un buffer en la base de datos
        });
    } catch (error) {
        console.log("Error al crear el amigurumi:", error);
        res.status(500).json({
            message: "Error interno del servidor al crear el amigurumi",
            error: error.message
        });
    }
};

export const getamigurumis = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM amigurumis");

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener amigurumiss:", error);
        res.status(500).json({
            message: "Error interno del servidor al obtener amigurumiss"
        });
    }
};


export const getamigurumisById = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM amigurumis WHERE id = ?", [req.params.id]);

        if (rows.length <= 0) {
            return res.status(404).json({
                message: "amigurumis no encontrado"
            });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error al buscar desings por ID:", error);
        res.status(500).json({
            message: "Error interno del servidor al buscar amigurumis por ID"
        });
    }
};

export const updateamigurumis = async (req, res) => {
    try {
        const { id, name, price } = req.body;

        // Verificar si el amigurumis existe antes de actualizar
        const [existingRows] = await pool.query("SELECT * FROM amigurumis WHERE id = ?", [id]);
        if (existingRows.length <= 0) {
            return res.status(404).json({
                message: "amigurumis no encontrado"
            });
        }
        // Actualizar el amigurumis
        await pool.query("UPDATE amigurumis SET name=?, price=?=? WHERE id=?",
            [name, price, id]);

        res.json({
            message: "amigurumis actualizado correctamente"
        });
    } catch (error) {
        console.error("Error al actualizar amigurumis:", error);
        res.status(500).json({
            message: "Error interno del servidor al actualizar amigurumis"
        });
    }
};

export const deleteamigurumis = async (req, res) => {
    try {
        const amigurumisId = req.params.id;
        const [existingRows] = await pool.query("SELECT * FROM amigurumis WHERE id = ?", [amigurumisId]);
        if (existingRows.length <= 0) {
            return res.status(404).json({
                message: "amigurumis no encontrado"
            });
        }
        // Eliminar el amigurumis
        await pool.query("DELETE FROM amigurumis WHERE id = ?", [amigurumisId]);
        res.json({
            message: "amigurumis eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar amigurumis:", error);
        res.status(500).json({
            message: "Error interno del servidor al eliminar amigurumis"
        });
    }
};
