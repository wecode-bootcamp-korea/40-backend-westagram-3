-- migrate:up
    CREATE TABLE users
    (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        eamil VARCHAR(100) NULL,
        password VARCHAR(50) NOT NULL,
        profile_image VARCHAR(1000) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- migrate:down
 DROP TABLE users;