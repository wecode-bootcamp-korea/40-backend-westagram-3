const http = require("http");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource, InsertValuesMissingError } = require("typeorm");
const dotenv = require("dotenv");
const app = express();

<<<<<<< Updated upstream
const { DataSource } = require("typeorm");
=======
const { profile } = require("console");
>>>>>>> Stashed changes
const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", cors(), function (req, res, next) {
  res.json({ message: "pong" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
