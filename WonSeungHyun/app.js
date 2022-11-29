const http = require("http");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");
const app = express();

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

appDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", function (req, res, next) {
  res.json({ message: "pong" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();

app.post("/users", async (req, res, next) => {
  const { name, email, profile_image } = req.body;

  await appDataSource.query(
    `
    INSERT INTO users(
    name,
    email,
    profile_image
    
  )VALUES (?, ?, ?)`,
    [name, email, profile_image]
  );
  res.status(201).json({ message: "successfully created" });
});

app.get("/search", async (req, res) => {
  await appDataSource.query(
    `SELECT
     u.id as userId,
     u.profile_image as userProfileImage,
     p.id as PostingId,
     
     p.content as PostingContent
     FROM posts p, users u
     WHERE p.user_id = u.id`,
    (err, rows) => {
      res.status(200).json(rows);
    }
  );
});
////유저가 작성한 게시물 불러오기 기능///
app.get("/search_user", async (req, res) => {
  await appDataSource.query(
    `SELECT
    u.id as userId,
    u.profile_image as userProfileImage,
    p.id as postingId,
    p.posting_img as postingImageUrl,
    p.content as postingContent
    FROM users u , posts p
    WHERE p.user_id = u.id
    
    `,
    (err, rows) => {
      res.status(200).json(rows);
    }
  );
});
////특정 유저 게시물 조회 기능///
app.get("/userposts/:inputId", async (req, res) => {
  const userId = req.params.inputId;
  const user = await appDataSource.manager.query(
    `SELECT
          users.id as userId,
          users.profile_image as userProfileImage
      FROM users
      WHERE users.id = ${userId};
      `
  );
  const userpost = await appDataSource.manager.query(
    `SELECT 
          posts.id as postingId,
          posts.posting_img as postingImageUrl,
          posts.content as postingContent
      FROM posts
      WHERE user_id = ${userId};`
  );

  user[0].posting = userpost;
  res.status(200).json({ data: user[0] });
});

///데이터 삭제 기능///

app.delete("/userposts/:inputId", async (req, res) => {
  const postId = req.params.inputId;
  const post = await appDataSource.manager.query(
    `DELETE 
     FROM posts
     WHERE posts.id = ${postId};
    `
  );
  res.status(200).json({ message: "postingDeleted" });
});

///게시물 수정하기///

app.patch("/userposts/:inputId/:patchContent", async (req, res) => {
  const postId = req.params.inputId;
  const patchCon = req.params.patchContent;
  const post = await appDataSource.manager.query(
    `UPDATE posts SET
     content = '${patchCon}'
     WHERE posts.id = ${postId};
    `
  );
  res.status(200).json({ message: "postingPatched" });
});

//좋아요 기능 추가
app.post("/userslikes", async (req, res, next) => {
  const { user_id, post_id } = req.body;

  await appDataSource.query(
    `
    INSERT INTO likes(
    user_id,
    post_id
  )VALUES (?, ?)`,
    [user_id, post_id]
  );
  res.status(201).json({ message: "likeCreated" });
});
