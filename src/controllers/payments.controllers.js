import MercadoPago from 'mercadopago';
import { pool } from "../db.js";
import {MERCADOPAGO} from "../config.js"

// Configurar las credenciales de MercadoPago
MercadoPago.configure({
  access_token: MERCADOPAGO
});

// Ruta para procesar el pago
export const processPayment = async (req, res) => {
  try {
    const userId = req.params.userId; // Obtener el ID del usuario de req.params
    const { items, payer } = req.body;

    // Crear la preferencia de pago en MercadoPago
    const preference = {
      items: items.map(item => ({
        title: item.name,
        quantity: item.quantity,
        currency_id: 'ARS', // Moneda (Argentina)
        unit_price: item.price
      })),
      payer: {
        email: payer.email // Email del comprador
      }
    };

    const response = await MercadoPago.preferences.create(preference);

    // Guardar la información de la transacción en la base de datos
    const transactionId = response.body.id;

    // Insertar la información de la transacción en la tabla de transacciones
    const insertQuery = "INSERT INTO transactions (transaction_id, user_id) VALUES (?, ?)";
    await pool.query(insertQuery, [transactionId, userId]);

    res.json({ redirectUrl: response.body.init_point });
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    res.status(500).json({
      message: "Error interno del servidor al procesar el pago"
    });
  }
};

// Ruta para actualizar el estado del pago después de que se complete
export const updatePaymentStatus = async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    // Actualizar el estado del pago en la base de datos
    const updateQuery = "UPDATE transactions SET status = ? WHERE transaction_id = ?";
    await pool.query(updateQuery, [status, transactionId]);

    res.json({ message: "Estado del pago actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado del pago:", error);
    res.status(500).json({
      message: "Error interno del servidor al actualizar el estado del pago"
    });
  }
};

// Ruta para obtener información sobre una transacción específica por su ID
export const getTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.id;

    // Buscar la transacción en la base de datos por su ID
    const selectQuery = "SELECT * FROM transactions WHERE transaction_id = ?";
    const [rows] = await pool.query(selectQuery, [transactionId]);

    // Verificar si se encontró la transacción
    if (rows.length === 0) {
      return res.status(404).json({
        message: "Transacción no encontrada"
      });
    }

    // Devolver la información de la transacción
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener la transacción:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener la transacción"
    });
  }
};

// Ruta para obtener todas las transacciones
export const getAllTransactions = async (req, res) => {
  try {
    // Obtener todas las transacciones de la base de datos
    const selectQuery = "SELECT * FROM transactions";
    const [rows] = await pool.query(selectQuery);

    // Devolver todas las transacciones
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener todas las transacciones:", error);
    res.status(500).json({
      message: "Error interno del servidor al obtener todas las transacciones"
    });
  }
};
