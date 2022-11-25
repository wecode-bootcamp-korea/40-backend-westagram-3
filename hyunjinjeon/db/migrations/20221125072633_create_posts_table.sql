-- migrate:up
ALTER TABLE posts ADD COLUMN user_id VARCHAR(50) NOT NULL;
ALTER TABLE posts ADD CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);


-- migrate:down
DROP TABLE posts;


select
users.user_name,
users.user_email,
posts.title
from posts
left join users on users.user_id=posts.user_id;