//Built-in package
const http =require ("http");

//Third-party package
const express = require("express");
const cors = require("cors");
const morgan =  require("morgan");
const dotenv = require("dotenv");
const { DataSource } = require('typeorm'); 

//Custom package
dotenv.config()
app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));


const appDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

//Error handling
appDataSource.initialize()
  .then(()=>{
    console.log("Data Source has been initialized!")
  });


//User signup endpoint
app.post('/signup',async(req,res)=>{
    const {name,email,password,age} = req.body
    await appDataSource.query(
        `INSERT INTO users (
          name,
          email,
          password,
          age
       ) VALUES(?,?,?,?);
        `,[name,email,password,age]);

    res.status(200).json({message:"userCreated"});
})


//Posting endpoint
app.post('/posts',async(req,res)=>{
    const {title,content} = req.body
    await appDataSource.query(
      `INSERT INTO posts (
        title,
        content
     ) VALUES(?,?);
    `,[title,content]);
    res.status(200).json({message:"postCreated"});
 })



const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () =>{
    server.listen(PORT, ()=> console.log(`server is listening to ${PORT}`))
}

start()


