"use strict";

const request = require("supertest");

const app = require("../app");

const { 
  commonBeforeAll, 
  commonBeforeEach, 
  commonAfterEach, 
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  const newStudent = {
    username: "newusername",
    password: "password",
    firstName: "FirstTest",
    lastName: "LastTest",
    email: "test@mail.com"
  };

  test("works", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send(newStudent);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      "token": expect.any(String)
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "newusername",
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "newusername",
        password: "password",
        firstName: "FirstTest",
        lastName: "LastTest",
        email: "notemail"
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/login */

describe("POST /auth/login", function () {

  test("works", async function () {
    const resp = await request(app)
      .post("/auth/login")
      .send({
        username: "username1", 
        password: "password1"
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      "token": expect.any(String)
    });
  });

  test("not found if no username", async function () {
    const resp = await request(app)
      .post("/auth/login")
      .send({
        username: "notausername", 
        password: "password"
      });
    expect(resp.statusCode).toEqual(404);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
      .post("/auth/login")
      .send({
        username: "username1", 
        password: "notthepassword"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with invalid username data", async function () {
    const resp = await request(app)
      .post("/auth/login")
      .send({
        username: 200000000,
        password: "password"
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with missing password", async function () {
    const resp = await request(app)
      .post("/auth/login")
      .send({
        username: "username1"
      });
    expect(resp.statusCode).toEqual(400);
  });
});
