-- migrate:up
ALTER TABLE users CHANGE COLUMN name user_name  VARCHAR(50)NOT NULL;
ALTER TABLE users CHANGE COLUMN email user_email VARCHAR(50)NOT NULL;
ALTER TABLE users CHANGE COLUMN age user_age VARCHAR(50)NOT NULL;


-- migrate:down
DROP TABLE users;

