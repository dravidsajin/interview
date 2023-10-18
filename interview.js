const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//loading the env variables
dotenv.config();
const port = process.env.PORT;

// xss middleware
const xssMiddleware = require("./middleware/xss-middleware");

// importing controllers
const interviewController = require("./controllers/interview-controller");

// Creating server
const app = express();

// Applying body parser middleware to accept the payload
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Enabling Middleware
app.use(
  cors({
    origin: ["http://localhost:5000"],
  })
);

app.use(helmet());
app.use(hpp()); // To avoid the pollution attack
app.use(xssMiddleware); // To avoid xss attack
app.use(compression());

// swagger setup
const options = {
  definition: {
    info: {
      title: "Interview Assignment",
      version: "1.0.0",
      description: "App backend contains the interview API endpoints",
    },
  },
  securityDefinitions: {
    JWT: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  apis: ["controllers/*.js"],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Use the user controller for routes
app.use("/interview", interviewController);

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
