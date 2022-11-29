-- migrate:up

CREATE TABLE likes (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL UNIQUE,
  post_id int NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (id),
 FOREIGN KEY (user_id) REFERENCES users (id),
 FOREIGN KEY (post_id) REFERENCES posts (id)
);


-- migrate:down
TABLE DROP likes;
