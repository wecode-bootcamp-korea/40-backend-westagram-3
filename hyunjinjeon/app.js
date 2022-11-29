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

    res.status(201).json({message:"userCreated"});
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
    res.status(201).json({message:"postCreated"});
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
  

  //게시물 특정유저 게시물조회 엔드포인트

app.get("/user/post/:userId", async (req,res) => {
  const userId = req.params.userId;
  const user = await appDataSource.query(
    `SELECT
      users.id as userId,
      users.profile_image as userprofileImage
    FROM users
    WHERE users.id = ${userId};`,
  );
  const post = await appDataSource.query(
    `SELECT
      posts.id as postingId,
      posts.title as postingImageUrl,
      posts.content as postingContent
    FROM posts
    WHERE posts.user_id = ${userId};`,
  );
  user[0].postings = post;
  const result = user[0];
  res.status(200).json({data:result})
})

//게시물 수정 엔드포인트
app.patch("/post/:postId", async (req, res, next) => {
  const postId = req.params.postId;
  const {content} = req.body;
  await appDataSource.query(
    `UPDATE posts SET
      content = ?
    WHERE id = ${postId}
    `,[content]);
  const post = await appDataSource.query(
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
app.delete("/post/:postId",async(req,res,next)=>{
  const postId = req.params.postId;
  await appDataSource.query(
    `DELETE FROM posts
    WHERE posts.id = ${postId}`,
    );
    res.status(204).json({message:"postingDeleted"});
})

//좋아요 누르기 엔드포인트
app.post('/like/:userId/:postId',async(req,res,next)=>{
    const userId = req.params.userId;
    const postId = req.params.postId;
    const {userid,postid} = req.body;
    await appDataSource.query(
      `INSERT INTO likes (
        user_id,
        post_id
     ) VALUES(${userId},${postId});
    `,[userid,postid]);
    res.status(200).json({message:"likeCreated"})
   
})


const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () =>{
    server.listen(PORT, ()=> console.log(`server is listening to ${PORT}`))
}
start()




