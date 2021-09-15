"use strict";

const db = require("../db.js");
const Student = require("../models/student");

const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  await db.query("DELETE FROM students");
  
  await Student.register({
    username: "username1",
    password: "password1",
    firstName: "First1",
    lastName: "Last1",
    email: "email1@mail.com",
  });

  await Student.register({
    username: "username2",
    password: "password2",
    firstName: "First2",
    lastName: "Last2",
    email: "email2@mail.com",
  });  
  
  await Student.register({
    username: "username3",
    password: "password3",
    firstName: "First3",
    lastName: "Last3",
    email: "email3@mail.com",
  });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "username1" });
const u2Token = createToken({ username: "username2" });
const u3Token = createToken({ username: "username3" });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token
};
