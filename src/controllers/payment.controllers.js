import { config } from "dotenv"
import { Router } from "express";
import mercadopago from "mercadopago";
config()
const Mercado_Pago = Router();

mercadopago.configure({
    access_token: process.env.ACCESS - TOKEN - MercadoPagoConfig
});


Mercado_Pago.post("/", async (req, res) => {
    try {
        const preference = {
            items: [
                {
                    title: "Muñeco",
                    unit_price: 200,
                    currency_id: "ARS",
                    description: "muñequito amigurumi",
                    quantity: 1,
                },
            ],
            back_urls: {
                success: "",
                failure: ""
            },

            auto_return: "approved",
        };

        const respuesta = await mercadopago.preferences.create(preference);
        console.log(respuesta);
        res.status(200).json(respuesta);
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message)
    }
});

