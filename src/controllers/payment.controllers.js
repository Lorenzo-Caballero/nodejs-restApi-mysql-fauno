import { Payment } from 'mercadopago';

// Inicializar el objeto de API y configurar el cliente al mismo tiempo
const payment = new Payment({
  accessToken: 'TEST-3230960472138078-032423-ab23df1b92b9867ed719267ec3327511-1742793404',
  options: { timeout: 5000, idempotencyKey: 'abc' }
});

export const createOrder = async (req, res) => {
  try {
    // Crear el objeto de solicitud
    const body = {
      transaction_amount: 4000, // Monto de la transacción
      description: 'Diseño Tattoo', // Descripción del artículo
      payment_method_id: 'visa', // ID del método de pago (por ejemplo, 'visa', 'mastercard', etc.)
      payer: {
        email: 'email@example.com' // Correo electrónico del comprador
      },
    };

    // Crear el objeto de opciones de solicitud - Opcional
    const requestOptions = {
      idempotencyKey: 'abc', // Clave de idempotencia
    };

    // Realizar la solicitud
    const result = await payment.create({ body, requestOptions });

    res.send(result);
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
  }
};
