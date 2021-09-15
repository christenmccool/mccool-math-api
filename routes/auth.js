"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const Student = require("../models/student");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const  studentNewSchema = require("../schema/studentNew.json");
const  studentLogInSchema  = require("../schema/studentLogIn.json");
const { BadRequestError } = require("../expressError");


/** POST /auth/register:   { student } => { token }
 *
 * student must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token to authenticate further requests
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, studentNewSchema);

    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newStudent = await Student.register(req.body);
    const token = createToken(newStudent.username);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});
  

router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, studentLogInSchema);

    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const student = await Student.login(req.body.username, req.body.password);
    const token = createToken(student.username);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;