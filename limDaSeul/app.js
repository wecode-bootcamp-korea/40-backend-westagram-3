const http = require("http");
require('dotenv').config();
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

const { DataSource } = require('typeorm');

const app = express();

const database = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEOMR_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
}) 

database.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
    database.destroy()
  })

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//health check
app.get("/ping", (req, res) => {
  res.status(200).json({"message" : "pong"});
})

const PORT = process.env.PORT

const start = async () => {
  try{
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch(err) {
    console.error(err);
  }
};

start();