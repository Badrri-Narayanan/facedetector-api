BEGIN TRANSACTION;

CREATE TABLE users (
    id serial PRIMARY KEY,
    name varchar(100),
    email text UNIQUE NOT NULL,
    entries BIGINT default 0,
    joined TIMESTAMP NOT NULL,
    age int default 0,
    pet varchar(100) default 'none'
);

COMMIT;