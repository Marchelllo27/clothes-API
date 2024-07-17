const express = require("express");
const cors = require("cors");

const stripe = require("stripe")(STRIPE_PRIVATE_KEY);

const { createSessionController } = require("./controllers/create-session-controller.js");
const { getAllProductsController } = require("./controllers/get-all-products-controller.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.get("/", (req, res) => {
  return res.json("Hello, server works!");
});

app.get("/get-all-products", getAllProductsController);

app.post("/create-checkout-session", createSessionController);

app.listen(process.env.PORT || 3001);
