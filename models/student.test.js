"use strict";

const { 
  NotFoundError, 
  BadRequestError, 
  UnauthorizedError 
} = require("../expressError");

const db = require("../db.js");
const Student = require("./student.js");

const { 
  commonBeforeAll, 
  commonBeforeEach, 
  commonAfterEach, 
  commonAfterAll, 
} = require("./_testCommon");
const { fail } = require("assert");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** register */

describe("register", function () {

  const newStudent = {
    username: "newusername",
    password: "password",
    firstName: "FirstTest",
    lastName: "LastTest",
    email: "test@mail.com"
  };

  test("works", async function () {
    let student = await Student.register(newStudent);
    expect(student).toEqual({ ...newStudent, password: expect.any(String) });

    const found = await db.query(
      `SELECT username, password, first_name AS "firstName", last_name AS "lastName", email
        FROM students 
        WHERE username = 'newusername'`
    );

    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    expect(found.rows[0]).toEqual({ ...newStudent, password: expect.any(String) });
  });

  test("bad request with dup data", async function () {
    try {
      await Student.register(newStudent);
      await Student.register(newStudent);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

});

/************************************** log in */

describe("log in", function () {

  test("works", async function () {
    let student = await Student.login("username1", "password1");
    expect(student).toEqual({
      username: "username1",
      password: expect.any(String),
      firstName: "First1",
      lastName: "Last1",
      email: "user1@mail.com"
    });
  });

  test("not found with no user", async function () {
    try {
      await Student.login("nouser", "password");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("unauth with wrong password", async function () {
    try {
      let student = await Student.login("username1", "wrongpassword");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});
