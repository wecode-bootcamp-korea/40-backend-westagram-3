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
}); //새로운 데이터 소스 생성

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// localhost:3000/ping >> { message:"pong" }
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

const start = () => {
  appDataSource
    .initialize()
    .then(() => {
      console.log("데이터베이스 연결이 잘 되었습니다.");
    })
    .catch((err) => {
      console.log(err);
      console.log("데이터베이스 연결에 실패했습니다.");
    });

  app.listen(3000, () => console.log("서버가 켜짐"));
};

start();
