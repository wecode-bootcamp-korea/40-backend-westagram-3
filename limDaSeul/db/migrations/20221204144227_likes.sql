-- migrate:up
CREATE TABLE likes(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    postId INT NOT NULL,
    CONSTRAINT userId FOREIGN KEY (userId) REFERENCES users(id),
    CONSTRAINT postId FOREIGN KEY (postId) REFERENCES posts(id)
)

-- migrate:down
DROP TABLE likes