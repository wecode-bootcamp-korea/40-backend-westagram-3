-- migrate:up

    INSERT INTO users (name,eamil,password,profile_image) VALUES ('CUP','CUP123@email.com','123cup','cupimage.url');

    INSERT INTO users (name,eamil,password,profile_image) VALUES ('BOTTLE','BOT123@email.com','456boT','boTimage.url');

    INSERT INTO users (name,eamil,password,profile_image) VALUES ('CHARGER','CHAR123@email.com','789ch','CHARimage.url');

-- migrate:down

DROP TABLE users;