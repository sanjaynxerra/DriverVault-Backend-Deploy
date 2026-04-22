const express = require("express");
const cors = require("cors");
const testRoutes = require("./src/routes/test.route");
const errorHandler = require("./src/middlewares/error.middleware");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// routes
const routes = require("./src/routes");
app.use("/api", routes);

app.use("/api/test", testRoutes);

//Custom Error Middleware
app.use(errorHandler);

module.exports = app;
