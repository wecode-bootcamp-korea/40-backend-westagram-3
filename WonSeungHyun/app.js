const http = require("http");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");
const bcrypt = require("bcrypt");
const saltRounds = 12;
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
  const { name, email, profile_image, password } = req.body;

  const makeHash = await bcrypt.hash(password, saltRounds); // (4)

  await appDataSource.query(
    `
    INSERT INTO users(
      name,
      email,
      profile_image,
      password
    
  )VALUES (?, ?, ? , ?)`,
    [name, email, profile_image, makeHash]
  );
  res.status(201).json({ message: "successfully created" });
});
