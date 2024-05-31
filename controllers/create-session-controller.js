const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { fetchAllProducts } = require("./lib/helpers");
require("dotenv").config();

async function createSessionController(req, res) {
  try {
    //fetch all products
    const allProduts = await fetchAllProducts();

    //create a stripe session and generate url for payment page.
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        mode: "payment",

        line_items: req.body.items.map(item => {
          //find a producti by id.
          const storeItem = allProduts.find(i => i.id === item.id);
          //transform price in cents
          const priceInCents = parseFloat(storeItem.price).toFixed(2) * 100;
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: storeItem.title,
              },
              unit_amount: priceInCents,
            },
            quantity: item.quantity,
          };
        }),

        success_url: `${process.env.CLIENT_URL}/successful-payment`,
        cancel_url: `${process.env.CLIENT_URL}`,
      },
      { apiKey: process.env.STRIPE_PRIVATE_KEY }
    );

    res.json({ url: session.url });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ error: "Something went wrong on the server. The payment was not complete.Please try again later" });
  }
}

module.exports = { createSessionController };
