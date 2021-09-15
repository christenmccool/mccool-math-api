const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM students");

  await db.query(`
        INSERT INTO students 
          (username, password, first_name, last_name, email)
        VALUES ('username1', $1, 'First1', 'Last1', 'user1@mail.com'),
               ('username2', $2, 'First2', 'Last2', 'user2@mail.com'),              
               ('username3', $3, 'First3', 'Last3', 'user3@mail.com')          
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password3", BCRYPT_WORK_FACTOR)
      ]);
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


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};