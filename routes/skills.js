/** Routes for skills. */


const express = require("express");
// const { ensureLoggedIn } = require("../middleware/auth");
const LinearEquation = require("../models/lineareq");

const router = new express.Router();


/** GET /skills/linearequation:   => { linearEquation }
 *
 * returns a random Linear Equation
 *
 * linearEquation is {m, rise, run, b, exp, eq}
 *
 * Authorization required: logged in
 */

router.get("/lineareq", async function (req, res, next) {
  try {
    const newEq = new LinearEquation(50,5,5)
    return res.json({
      equation: newEq.eq,
      expression: newEq.exp,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

