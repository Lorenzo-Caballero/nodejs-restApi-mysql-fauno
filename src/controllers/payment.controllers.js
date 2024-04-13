import { MercadoPago, Payment } from "mercadopago";

// Configuración de MercadoPago
MercadoPago.configure({
  access_token: 'TEST-3230960472138078-032423-ab23df1b92b9867ed719267ec3327511-1742793404',
  // Otras opciones de configuración aquí si es necesario
});

export const createOrder = async (req, res) => {
  try {
    // Crear una instancia de Payment
    const payment = new Payment();

    // Crear un objeto de pedido con los detalles del artículo
    const preference = {
      items: [
        {
          title: "Diseño Tattoo",
          unit_price: 4000,
          currency_id: "ARS",
          quantity: 1,
        }
      ]
    };

    // Crear la preferencia de pago en MercadoPago
    const response = await payment.createPreference(preference);

    // Enviar la respuesta de MercadoPago al cliente
    res.json(response);
  } catch (error) {
    // Manejar errores
    console.error("Error al crear el pedido:", error);
    res.status(500).json({ error: "Hubo un error al procesar la solicitud." });
  }
};
