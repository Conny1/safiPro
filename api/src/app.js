const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { createRouteHandler } = require("uploadthing/express");

const app = express();
const appRoute = require("./routes");

dotenv.config();
app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PAYSTACK_BASE_URL,
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
// file upload via uploadthing

(async () => {
  const { uploadRouter } = await import("./uploadthing.mjs");

  app.use(
    "/api/uploadthing/:orderId",
    createRouteHandler({
      router: uploadRouter,
      config: {
        uploadthingToken: process.env.UPLOADTHING_TOKEN,
      },
    })
  );
})();
// All other api routes
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
