// const http = require ("http");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");
const { response, request } = require("express");

const app = express();

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
}); //새로운 데이터 소스 생성

appDataSource
  .initialize()
  .then(() => {
    console.log("데이터베이스 연결이 되었습니다.");
  })
  .catch((err) => {
    console.log(err);
    console.log("데이터베이스 연결에 실패했습니다.");
  });

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
// async ... await -> 비동기함수 실행
app.post("/users", async (request, response) => {
  const { name, email, profileImage, password } = request.body; // 비구조화할당, 구조분해할당

  // ================================ 참고 ================================
  // const request = {
  //   body: {
  //     "name": "kaeun",
  //     "email": "wevyeun@gmail.com",
  //     "profile_image": "https://ca.slack-edge.com/TH0U6FBTN-U04AMP2MYQ0-0983be7dc054-512",
  //     "password": "djskfj323"
  //   }
  // }
  // const a = {
  //   id: 1,
  //   name: "kaeun"
  // }

  // a.id = 1
  // a.name = "kaeun"
  // ================================ 참고 ================================

  await appDataSource.query(
    `INSERT INTO users(
        name,
        email,
        profile_image,
        password
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, profileImage, password]
  );

  response.status(201).json({ message: "seccessfully created" });
});

const PORT = process.env.PORT;

app.post("/post", async (request, response) => {
  const { title, content, imageUrl, userId } = request.body;

  await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      post_image,
      user_id
    ) VALUES (?, ?, ?, ?)`,
    [title, content, imageUrl, userId]
  );
  response.status(201).json({ message: "postCreated" });
});

app.get("/posts", async (request, response) => {
  await appDataSource.query(
    `SELECT
      u.id as userId,
      u.profile_image as userProfileImage,
      p.id as postingId,
      p.content as PostingContent
     FROM posts p
     INNER JOIN users u ON u.id = p.user_id
     WHERE p.user_id = u.id`,
    (err, rows) => {
      response.status(200).json(rows);
    }
  );
});

app.get("/posts/:userId", async (request, response) => {
  const { userId } = request.params;
  const posts = await appDataSource.query(
    `
    SELECT
      u.id as userId,
      u.profile_image as userProfileImage,
      p.id as postingTitle,
      p.content as postingContent
    FROM posts as p
    INNER JOIN users as u ON u.id = p.user-id
    WHERE p.user_id = ?
  `,
    [userId]
  );
  response.status(200).json({ data: post });
});

app.listen(3000, () => console.log(`SERVER IS LISTENING ON ${PORT}`));
