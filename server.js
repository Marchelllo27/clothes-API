const express = require("express");
const cors = require("cors");

const { createSessionController } = require("./controllers/create-session-controller.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.get("/", (req, res) => {
  return res.json("Hello, server works!");
});

app.post("/create-checkout-session", createSessionController);

app.listen(3001);
