-- migrate:up
CREATE TABLE likelist(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  postID INT NOT NULL,
  CONSTRAINT usersID FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT postsID FOREIGN KEY (postID) REFERENCES posts(id)
)

-- migrate:down
DROP TABLE likelist