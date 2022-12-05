//Built-in
const http =require ("http");

//Third-party
const express = require("express");
const cors = require("cors");
const morgan =  require("morgan");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { DataSource } = require('typeorm'); 

//Custom package
dotenv.config()
app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));


const appData = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

//Error handlingg
appData.initialize()
  .then(()=>{
    console.log("Data Source has been initialized!")
  });

  const saltRounds = 12; 
  const makeHash = async (password, saltRounds) => {
      return await bcrypt.hash(password, saltRounds); }
  const checkHash = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)}

//User signup endpoint
app.post('/signup',async(req,res)=>{
    const {name,email,profile_image,password} = req.body;
        const hashedPw = await makeHash(password, 12);
        try{
        await appData.query(
        `INSERT INTO users(
          name,
          email,
          profile_image,
          password
        ) VALUES (?,?,?,?)`,
       [name,email,profile_image,hashedPw]);
       res.status(201).json({message:"userCreated"});
       }
      catch{
       res.status(400).json({message:"Request Error"});
    }   
  })


//signin endpoint
app.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    const user = await appData.query(
      `SELECT
        u.email,
        u.password,
        FROM users u
        WHERE u.email=?`
        ,[email]);
    const pWmatch =checkHash(password,(users.password).toString())

  })

//Posting endpoint
app.post('/posts',async(req,res)=>{
    const {title,content} = req.body
    await appData.query(
      `INSERT INTO posts (
        title,
        content
     ) VALUES(?,?);
    `,[title,content]);
    res.status(201).json({message:"postCreated"});
 })


//게시물 전체조회 엔드포인트
 app.get('/get',async(req,res)=>{
  await appData.query(
    `SELECT
        users.name,
        posts.title,
        posts.created_at
     FROM posts
     LEFT JOIN users ON users.user_id = posts.user_id;
      `,(err,rows)=>
      {res.status(200).json(rows);});
  });

//특정유저 게시물 조회 엔드포인트
app.get("/posts/:userId", async (req,res) => {
  const userId = req.params.userId;
    await appData.query(
      `SELECT 
        users.id as userId,
        users.profile_image as userporfileImage,
        JSON_ARRAYAGG( 
        JSON_OBJECT(    
          'postingId',posts.id,
          'postingTitle',posts.title,
          'postingContent',posts.content)) as posting
      FROM users
      LEFT JOIN posts ON users.id = posts.user_id 
      WHERE users.id=${userId}
      GROUP BY users.id;
      `,(err, row)=>
      {res.status(200).json({data:row});});})

//게시물 수정 엔드포인트
app.patch("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  const {content} = req.body;
  await appData.query(
    `UPDATE posts SET
      content = ?
    WHERE id = ${postId}
    `,[content]);
  const post = await appData.query(
    `SELECT
      users.id as userId,
      users.name as userName,
      posts.id as postingId,
      posts.title as postingTitle,
      posts.content as postingContent
    FROM posts INNER JOIN users on users.id = posts.user_id where posts.id like ${postId};`,
    );
    const result = post[0];
    res.status(204).json({data : result});
  })

//게시글 삭제 엔드포인트
app.delete("/deletion/:postId",async(req,res)=>{
  const postId = req.params.postId;
  await appData.query(
    `DELETE FROM posts
    WHERE posts.id = ${postId}`,
    );
    res.status(204).json({message:"postingDeleted"});
})

//좋아요 누르기 엔드포인트
app.post('/likes',async(req,res)=>{
    const {userId,postId} = req.body
    await appData.query(
      `INSERT INTO likes (
        user_id,
        post_id
     ) VALUES(?, ?);
     `,
     [userId, postId]);
     res.status(201).json({message: "likeCreated"})
 })

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () =>{
    server.listen(PORT, ()=> console.log(`SERVER is listening tooooo ${PORT}`))}
start()
