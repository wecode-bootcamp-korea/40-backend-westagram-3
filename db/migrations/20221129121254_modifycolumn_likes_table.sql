-- migrate:up
ALTER TABLE likes MODIFY user_id int NOT NULL;

-- migrate:down
TABLE DROP likes;