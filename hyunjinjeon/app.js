//Built-in
const http =require ("http");

//Third-party
const express = require("express");
const cors = require("cors");
const morgan =  require("morgan");
const dotenv = require("dotenv");
const { DataSource } = require('typeorm'); 

//Custom
app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
dotenv.config()

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


// 유저 회원 가입 엔드포인트
app.post('/signup',async(req,res)=>{
    const {name,email,password,age} = req.body
    await appDataSource.query(
        `INSERT INTO users (
          user_name,
          user_email,
          user_password,
          user_age
       ) VALUES(?,?,?,?); 
        `,[name,email,password,age]);

    res.status(200).json({message:"userCreated"});
})


// 게시물등록 엔드포인트
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


//게시물 전체조회 엔드포인트
 app.get('/lookposts',async(req,res)=>{
  await appDataSource.query(
    `SELECT
        users.user_name,
        posts.title,
        posts.created_at
     FROM posts
     LEFT JOIN users ON users.user_id = posts.user_id;
      `,(err,rows)=>
      {res.status(200).json(rows);});
  });
  




const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () =>{
    server.listen(PORT, ()=> console.log(`server is listening to ${PORT}`))
}
start()
