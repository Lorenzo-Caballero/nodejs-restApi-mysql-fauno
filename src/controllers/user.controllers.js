import { pool } from "../db.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {config} from "dotenv"
config()
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                message: "Todos los campos (name, email) son obligatorios"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const [row] = await pool.query("INSERT INTO clientes(name, email,password) VALUES(?, ?, ?)",
            [name, email, hashedPassword]);
        res.json({
            id_client: row.insertId,
            name,
            email,
            hashedPassword
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({
            message: "Error interno del servidor al crear usuario",
            error: error.message // Agregado para imprimir el mensaje específico del error.
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM clientes");

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({
            message: "Error interno del servidor al obtener usuarios"
        });
    }
};


export const getUserById = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM clientes WHERE id = ?", [req.params.id_client]);

        if (rows.length <= 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error al buscar usuario por ID:", error);
        res.status(500).json({
            message: "Error interno del servidor al buscar usuario por ID"
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id, name, email } = req.body;

        // Verificar si el usuario existe antes de actualizar
        const [existingRows] = await pool.query("SELECT * FROM clientes WHERE id_client = ?", [id]);
        if (existingRows.length <= 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        // Actualizar el usuario
        await pool.query("UPDATE clientes SET name=?, email=?=? WHERE id=?",
            [name, email, id]);

        res.json({
            message: "Usuario actualizado correctamente"
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({
            message: "Error interno del servidor al actualizar usuario"
        });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Los campos email y password son obligatorios"
            });
        }
        const [rows] = await pool.query("SELECT * FROM clientes WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
            console.log("password",passwordMatch)
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Credenciales incorrectas"
            });
        }
        const token = jwt.sign(
            { userId: user.insertId, email: user.email },
            process.env.JWT_KEY, // Utiliza process.env.JWT_KEY para acceder al secreto JWT
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login exitoso",
            email:user.email,
            userId:user.id,
            name:user.name,
            role:user.role,
            coins:user.coins,
            token
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({
            message: "Error interno del servidor en el login",
            res
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        // Verifica si el usuario existe antes de eliminar
        const [existingRows] = await pool.query("SELECT * FROM users WHERE id_client = ?", [userId]);
        if (existingRows.length <= 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        // Eliminar el usuario
        await pool.query("DELETE FROM clientes WHERE id_client = ?", [userId]);
        res.json({
            message: "Usuario eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({
            message: "Error interno del servidor al eliminar usuario"
        });
    }
};