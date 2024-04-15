import { pool } from "../db.js"

export const createamigurumis = async (req, res) => {
    try {
        const { name, price } = req.body;
        const image = req.file.path;

        if (!name || !price || !image) {
            return res.status(400).json({
                massage: "Todos los campos son obligatorios"
            });
        }
        const [row] = await pool.query("INSERT INTO amigurumis (name , price,image) VALUES (?, ?, ?)",
            [name, price, image]);
        res.json({
            id: row.insertId,
            name,
            image,
            price
        });
    } catch (error) {
        console.log("che salio re mal la creacion del diseño", error);
        res.status(500).json({
            massage: "Error interno del servidor al crear el diseño",
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