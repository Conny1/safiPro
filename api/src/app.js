const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const appRoute = require("./routes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", appRoute);

module.exports = app;
