const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require('typeorm');

const dotenv = require("dotenv");
dotenv.config()

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

//Create user table
app.post("/users", async(req, res, next) => {
  const { name, email, profile_image, password } = req.body

  await appDataSource.query(
    `INSERT INTO users(
      name,
      email,
      profile_image,
      password
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, profile_image, password]
  );

  res.status(201).json({message : "userCreated"});
})

//Create post table
app.post("/posts", async(req, res, next) => {
  const { title, content, posting_image, user_id } = req.body

  await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      posting_image,
      user_id
    ) VALUES(?, ?, ?, ?);
    `,
    [title, content, posting_image, user_id]
  );

  res.status(200).json({message : "postCreated"});
})

//Get post list
app.get("/posts", async(req, res) => {
  await appDataSource.manager.query(
    `SELECT
        u.profile_image as userProfileImage,
        u.id as userID,
        p.id as postingId,
        p.posting_image as postingImageUrl,
        p.content as postingContent
      FROM users u, posts p
      WHERE u.id = p.id
      `,
      (err, rows) =>  {
         res.status(200).json(rows);
    })
})

//Update post
app.patch('/posts/update', async(req, res) => {
  const {title, content, posting_image, postID} = req.body

  await appDataSource.query(
    `UPDATE posts
    SET
      title = ?,
      content = ?,
      posting_image = ?
    WHERE posts.id = ?
    `,
    [title, content, posting_image, postID]
  );
  res.status(201).json({message : "[update]mission complete."});
});

//Delete post
app.delete('/posts/:postID', async(req, res) => {
  const {postID} = req.params;

  await appDataSource.query(
    `DELETE FROM posts
    WHERE posts.id = ${postID}
    `);
      res.status(200).json({message : "postingDeleted"});
})

//Update user's 'like it'
app.post('/likelist', async(req, res) => {
  const {user_id, postID} = req.body

  await appDataSource.query(
    `INSERT INTO likelist(
      user_id,
      postID
    )VALUES(?,?);
    `,
    [user_id, postID]
  );

  res.status(200).json({message : "likeCreated"});
})

//Get user's post
app.get("/users/postlist/:userID", async(req, res) => {
  const userID  = req.params.userID
  await appDataSource.query(
    `SELECT
        u.id as userID,
        u.profile_image as userProfileImage,
      JSON_ARRAYAGG(
        JSON_OBJECT(
        p.id, postingId, 
        p.posting_image, postingImageUrl,
        p.content, postingContent))
      FROM posts p
      INNER JOIN users u
      ON u.id = ${userID}
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