-- migrate:up
ALTER TABLE likes ADD UNIQUE (user_id,post_id);

-- migrate:down
TABLE DROP likes;
