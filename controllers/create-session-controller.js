require("dotenv").config();

const { fetchAllProducts } = require("./lib/helpers");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

async function createSessionController(req, res) {
  try {
    //response with error if there is no items in the cart from a client side.
    const items = req.body?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    //fetch all products
    const allProduts = await fetchAllProducts();

    //find every product by id and reject the request if any id is unknown.
    const lineItems = [];
    const unknownIds = [];
    for (const item of items) {
      const storeItem = allProduts.find(i => i.id === item?.id);
      if (!storeItem) {
        unknownIds.push(item?.id);
        continue;
      }
      lineItems.push({ storeItem, quantity: item.quantity });
    }
    if (unknownIds.length) {
      return res.status(400).json({ error: `Unknown product id(s): ${unknownIds.join(", ")}` });
    }

    //create a stripe session and generate url for payment page.
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        mode: "payment",

        line_items: lineItems.map(({ storeItem, quantity }) => {
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
            quantity,
          };
        }),

        success_url: `${process.env.CLIENT_URL}/successful-payment`,
        cancel_url: `${process.env.CLIENT_URL}`,
      },
      { apiKey: process.env.STRIPE_PRIVATE_KEY },
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
