-- migrate:up
CREATE TABLE likes(
id int NOT NULL AUTO_INCREMENT,
user_id int NOT NULL,
post_id int NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- migrate:down
DROP TABLE likes;

