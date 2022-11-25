const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require('typeorm');

const dotenv = require("dotenv");
dotenv.config()

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

const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//health check
app.get("/ping", (req, res) => {
  res.status(200).json({"message" : "pong"});
})

//Create a book
app.post("/books", async (req, res, next) => {
  const { title, description, coverImage } = req.body

  await appDataSource.query(
    `INSERT INTO books(
      title,
      description,
      cover_image
    ) VALUES (?, ?, ?);
    `,
    [title, description, coverImage]
  );

  res.status(201).json({message : "successfully created"});
})

//Get all books
app.get('/books', async (req, res) => {
  await appDataSource.manager.query(
    `SELECT
          b.id,
          b.title,
          b.description,
          b.cover_image
      FROM books b`
    ,(err, rows) => {
        res.status(200).json(rows);
    })
});

//Get all books along with authors
app.get('/books-with-authors', async(req, res) => {
  await appDataSource.manager.query(
    `SELECT
          books.id,
          books.title,
          books.description,
          books.cover_image,
          authors.first_name,
          authors.last_name,
          authors.age
        FROM books_authors ba
        INNER JOIN authors ON ba.author_id = authors.id
        INNER JOIN books ON ba.book_id = books.id`
    ,(err, rows) => {
        res.status(200).json(rows);
    })
});

//Update a single book by its primary key
app.patch('/books', async(req, res) => {
  const { title, description, coverImage, bookID } = req.body

  await appDataSource.query(
    `UPDATE books
    SET
      title = ?,
      description = ?,
      cover_image = ?
      WHERE id = ?
      `,
      [ title, description, coverImage, bookID ]
  );
    res.status(201).json({ message : "successfully updated"});
});

app.delete('/books/:bookId', async(req, res) => {
  const { bookId } = req.params;

  await appDataSource.query(
    `DELETE FROM books
    WHERE books.id = ${bookId}
    `);
    res.status(200).json({ message : "successfully deleted" });
});

const start = async () => {
  try{
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch(err) {
    console.error(err);
  }
};

start();