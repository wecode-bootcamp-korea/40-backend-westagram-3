-- migrate:up
CREATE TABLE likes (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  post_id int NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (id),
 CONSTRAINT user_post_fkey FOREIGN KEY (user_id) REFERENCES users (id),
 CONSTRAINT UC_likes UNIQUE (user_id,post_id) 
);


-- migrate:down
TABLE DROP likes;
