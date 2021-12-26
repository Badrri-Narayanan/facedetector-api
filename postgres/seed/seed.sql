-- creating test data
BEGIN TRANSACTION;

insert into login (hash, email) values('$2a$04$lvK6HpXxNy5kkHthZpyvp.XDdw6iZVuevbJTmi4cHCbK5KbvF1fuy', 'test@gmail.com');
insert into users (name, email, entries, joined) values('testtest', 'test@gmail.com', 4, '2021-12-26');

COMMIT;