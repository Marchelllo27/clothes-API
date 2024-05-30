const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const storeItems = [
  {
    category: "men's clothing",
    priceInCents: 1000,
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    id: 1,
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    price: 109.95,
    rating: { rate: 3.9, count: 120 },
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  },
  {
    category: "men'ssss clothing",
    priceInCents: 5000,
    description:
      "asfasfasfas perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    id: 2,
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    price: 22.95,
    rating: { rate: 3.9, count: 120 },
    title: "HAHAHA - Foldsack No. 1 Backpack, Fits 15 Laptops",
  },
];

async function createSessionController(req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.find(i => i.id === item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.title,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ error: "Something went wrong on the server. The payment was not complete.Please try again later" });
  }
}

module.exports = { createSessionController };
