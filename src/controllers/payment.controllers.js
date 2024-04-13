import { MercadoPagoConfig, Payment } from 'mercadopago';

// Paso 1: Importar las partes del módulo que deseas usar

// Paso 2: Inicializar el objeto cliente
const client = new MercadoPagoConfig({ accessToken: 'TEST-3230960472138078-032423-ab23df1b92b9867ed719267ec3327511-1742793404', options: { timeout: 5000, idempotencyKey: 'abc' } });

// Paso 3: Inicializar el objeto de API
const payment = new Payment(client);

export const createOrder = async (req, res) => {
  try {
    // Paso 4: Crear el objeto de solicitud
    const body = {
      transaction_amount: 4000, // Monto de la transacción
      description: 'Diseño Tattoo', // Descripción del artículo
      payment_method_id: 'visa', // ID del método de pago (por ejemplo, 'visa', 'mastercard', etc.)
      payer: {
        email: 'TESTUSER46340066' // Correo electrónico del comprador
      },
    };

    // Paso 5: Crear el objeto de opciones de solicitud - Opcional
    const requestOptions = {
      idempotencyKey: 'abc', // Clave de idempotencia
    };

    // Paso 6: Realizar la solicitud
    const result = await payment.create({ body, requestOptions });

    res.send(result);
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
  }
};
