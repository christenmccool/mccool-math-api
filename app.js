"use strict";

/** Express app for backend of McCool Math. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const skillsRoutes = require("./routes/skills");
const viewRoutes = require("./routes/views");


const morgan = require("morgan");

const app = express();

app.use(express.static(`static`));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/skills", skillsRoutes);
app.use(viewRoutes);

/** Handle 404 errors */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
