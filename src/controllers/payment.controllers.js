import mercadopago from "mercadopago";

export const createOrder = async (req, res) => {
    mercadopago.configure({
        access_token:
            "TEST-3230960472138078-032423-ab23df1b92b9867ed719267ec3327511-1742793404",
    });

    const result = await mercadopago.preferences.create({
        items: [
            {
                title: "Diseño Tattoo",
                unit_price: 4000,
                currency_id: "ARS",
                quantity: 1,
            }
        ]
    })
    res.send(result)
};