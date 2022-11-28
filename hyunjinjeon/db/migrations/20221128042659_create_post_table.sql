-- migrate:up

CREATE TABLE posts 
(
  id int NOT NULL AUTO_INCREMENT,
  title varchar(50) NOT NULL,
  content varchar(2000) DEFAULT NULL,
  post_image varchar(1000) DEFAULT NULL,
  user_id int NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (id),
 FOREIGN KEY (user_id) REFERENCES users (id)
);

-- migrate:down

DROP TABLE posts;



