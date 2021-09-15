"use strict";

/** Routes for static html files. */

const express = require("express");
// const { ensureLoggedIn, ensureAdmin, ensureSelfOrAdmin } = require("../middleware/auth");
// const { BadRequestError } = require("../expressError");

const router = new express.Router();


/** serve homepage ---  static HTML */

router.get('/', function(req, res, next) {
  res.sendFile(`/index.html`);
});

router.get('/eqs-from-graphs', function(req, res, next) {
  res.sendFile(`/eqs-from-graphs.html`);
});


module.exports = router;
