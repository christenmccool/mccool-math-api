DROP DATABASE mccoolmath;
CREATE DATABASE mccoolmath;
\c mccoolmath 

DROP TABLE IF EXISTS students;

CREATE TABLE students (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL
        CHECK (position('@' IN email) > 1)
);

-- both test users have the password "password"

INSERT INTO students (username, password, first_name, last_name, email)
    VALUES ('username1',
                '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
                'First1',
                'Last1',
                'email1@mail.com'),
            ('username2',
                '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
                'First2',
                'Last2!',
                'email2@mail.com')
;

DROP DATABASE mccoolmath_test;
CREATE DATABASE mccoolmath_test;

\c mccoolmath_test 

DROP TABLE IF EXISTS students;

CREATE TABLE students (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL
        CHECK (position('@' IN email) > 1)
);
