require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { DataSource } = require('typeorm');

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEOMR_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
}) 

appDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
    database.destroy()
  })

const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.post("/users", async(req, res, next) => {
  const { name, email, profileImage, password } = req.body

  await appDataSource.query(
    `INSERT INTO users(
      name,
      email,
      profileImage,
      password
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, profileImage, password]
  );

  res.status(201).json({message : "userCreated"});
})

app.post("/posts", async(req, res, next) => {
  const { title, content, postingImage, userId } = req.body

  await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      postingImage,
      userId
    ) VALUES(?, ?, ?, ?);
    `,
    [title, content, postingImage, userId]
  );
  res.status(200).json({message : "postCreated"});
})

app.get("/posts", async(req, res) => {

  await appDataSource.manager.query(
    `SELECT
        u.profileImage as userProfileImage,
        u.id as userId,
        p.id as postingId,
        p.postingImage as postingImageUrl,
        p.content as postingContent
      FROM users u, posts p
      WHERE u.id = p.id
      `,
      (err, rows) =>  {
         res.status(200).json(rows);
    })
})

app.patch('/posts/update/:postId', async(req, res) => {
  const postId = req.params.postId;
  const { title, content, postingImage } = req.body

  await appDataSource.query(
    `UPDATE posts
    SET
      title = ?,
      content = ?,
      postingImage = ?
    WHERE id = ${postId}
   `,
    [title, content, postingImage]
    );

  const posting = await appDataSource.query(
    `SELECT
        u.id as userId,
        u.name as userName,
        p.id as postingId,
        p.title as postingTitle,
        p.content as postingContent
      FROM posts p
      INNER JOIN users u
      ON u.id = p.userId
      WHERE p.id
    `);
  res.status(201).json({data : posting[0]});
});

app.delete('/posts/:postId', async(req, res) => {
  const { postId } = req.params;

  await appDataSource.query(
    `DELETE FROM posts
    WHERE posts.id = ${postId}
    `);
      res.status(200).json({message : "postingDeleted"});
})

app.post('/likes', async(req, res) => {
  const { userId, postId } = req.body

  await appDataSource.query(
    `INSERT INTO likes(
      userId,
      postId
    )VALUES(?,?);
    `,
    [userId, postId]
  );

  res.status(200).json({message : "likeCreated"});
})

app.get("/users/posts/:userId", async(req, res) => {
  const userId  = req.params.userId
  
  await appDataSource.query(
    `SELECT
        u.id as userId,
        u.profileImage,
      JSON_ARRAYAGG(
        JSON_OBJECT(
        p.id as postingId, 
        p.postingImage as postingImageUrl,
        p.content as postingContent
        ))
      FROM posts p
      INNER JOIN users u
      ON u.id = ${userId}
      GROUP BY u.id
      `,
      (err, rows) => {
        res.status(200).json(rows)
       }
    )
});


const start = async () => {
  try{
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch(err) {
    console.error(err);
  }
};

start();