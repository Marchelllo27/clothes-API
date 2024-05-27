const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3001" }));

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today Course" }],
  [2, { priceInCents: 20000, name: "Learn CSS today" }],
]);

app.post("create-checkout-session", (req, res) => {
  res.json({ url: "hi" });
});

app.listen(3000);
