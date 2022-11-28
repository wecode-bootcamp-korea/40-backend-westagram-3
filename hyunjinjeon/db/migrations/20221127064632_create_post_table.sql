-- migrate:up
    
    INSERT INTO posts (title,content,user_id) VALUES ('postingTitle1','postingContent1',1);
    INSERT INTO posts (title,content,user_id) VALUES ('postingTitle2','postingContent2',1);
    INSERT INTO posts (title,content,user_id) VALUES ('postingTitle3','postingContent3',1);
    INSERT INTO posts (title,content,user_id) VALUES ('postingTitle4','postingContent4',2);
    INSERT INTO posts (title,content,user_id) VALUES ('postingTitle5','postingContent5',2);
    INSERT INTO posts (title,content,user_id) VALUES ('postingTitle6','postingContent6',3);
    
-- migrate:down

DROP TABLE posts;