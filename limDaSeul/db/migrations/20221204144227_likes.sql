-- migrate:up
CREATE TABLE likes(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  postId INT NOT NULL,
  CONSTRAINT userID FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT postId FOREIGN KEY (postId) REFERENCES posts(id)
)

-- migrate:down
DROP TABLE likes