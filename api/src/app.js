const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const appRoute = require("./routes");

dotenv.config();
app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/", appRoute);

app.use((err, req, resp, next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";

  resp.status(status).json({
    status: status,
    message: message,
    stack: err.stack,
  });
});

module.exports = app;
