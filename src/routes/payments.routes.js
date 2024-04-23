import express from 'express';
import {
  processPayment,
 // updatePaymentStatus,
  //getTransactionById,
  //getAllTransactions
} from '../controllers/payments.controllers.js';

const router = express.Router();

// Ruta para procesar el pago
router.post('/users/transactions/process', processPayment);

// Ruta para actualizar el estado del pago después de que se complete
/*router.put('/transactions/updateStatus', updatePaymentStatus);

// Ruta para obtener información sobre una transacción específica por su ID
router.get('/transactions/:id', getTransactionById);

// Ruta para obtener todas las transacciones
router.get('/transactions', getAllTransactions);*/

export default router;
