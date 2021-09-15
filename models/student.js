"use strict";

/** User in McCool Math app */

const db = require("../db");
const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");

const {NotFoundError, BadRequestError, UnauthorizedError} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Student class. */

class Student {
  constructor({ username, password, firstName, lastName, email }) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  /** Register student with data.
   *
   * Returns { username, hashedPassword, firstName, lastName, email }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
      `SELECT username
       FROM students
       WHERE username = $1`,
    [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }
    
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO students
        (username, password, first_name, last_name, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING username, password, first_name AS "firstName", last_name AS "lastName", email`,
      [username, hashedPassword, firstName, lastName, email]
    )

    return new Student(result.rows[0]);
  }

  /** Log in student with username and password.
   *
   * Returns { username, hashedPassword, firstName, lastName, email }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async login( username, password ) {
    const results = await db.query(
      `SELECT username, password, first_name AS "firstName", last_name AS "lastName", email
        FROM students
        WHERE username = $1`,
    [username],
    );

    const student = results.rows[0];

    if (!student) throw new NotFoundError(`Student not found: ${username}`);
    
    if (student) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, student.password);
      if (isValid === true) {
        return new Student(student);
      }
    }

    throw new UnauthorizedError(`Incorrect password`);
  }
}

module.exports = Student;
