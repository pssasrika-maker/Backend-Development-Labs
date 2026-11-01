const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "books.db");

let db = null;

// Initialize Database and Server
const initializeDBAndServer = async () => {
  try {
    // Connect to SQLite database
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create books table
    await db.run(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      );
    `);

    // Insert initial books only if database is empty
    const existingBooks = await db.get(
      "SELECT COUNT(*) AS count FROM book;"
    );

    if (existingBooks.count === 0) {
      const books = [
        ["The Alchemist", "Paulo Coelho", 399, 208],
        ["Harry Potter", "J.K. Rowling", 499, 320],
        ["Atomic Habits", "James Clear", 599, 320],
        ["The Great Gatsby", "F. Scott Fitzgerald", 350, 180],
        ["Rich Dad Poor Dad", "Robert Kiyosaki", 450, 336],
        ["Think and Grow Rich", "Napoleon Hill", 400, 238],
        ["Wings of Fire", "A.P.J. Abdul Kalam", 300, 180],
        ["Ikigai", "Hector Garcia", 499, 208],
        ["The Psychology of Money", "Morgan Housel", 550, 256],
        ["1984", "George Orwell", 350, 328],
      ];

      for (const book of books) {
        await db.run(
          `INSERT INTO book (title, author, price, pages)
           VALUES (?, ?, ?, ?)`,
          book
        );
      }

      console.log("10 books inserted successfully");
    }

    // Start server
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};


// GET all books
app.get("/books/", async (request, response) => {
  const getBooksQuery = `
    SELECT *
    FROM book;
  `;

  const booksArray = await db.all(getBooksQuery);

  response.status(200).send(booksArray);
});


// GET one book
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const getBookQuery = `
    SELECT *
    FROM book
    WHERE id = ?;
  `;

  const book = await db.get(getBookQuery, [bookId]);

  if (book === undefined) {
    response.status(404).send("Book Not Found");
  } else {
    response.status(200).send(book);
  }
});


// POST a new book
app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;

  const addBookQuery = `
    INSERT INTO book (title, author, price, pages)
    VALUES (?, ?, ?, ?);
  `;

  const result = await db.run(
    addBookQuery,
    [title, author, price, pages]
  );

  response.status(201).send({
    message: "Book Successfully Added",
    id: result.lastID,
  });
});


// PUT update a book
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  const updateBookQuery = `
    UPDATE book
    SET
      title = ?,
      author = ?,
      price = ?,
      pages = ?
    WHERE id = ?;
  `;

  const result = await db.run(
    updateBookQuery,
    [title, author, price, pages, bookId]
  );

  if (result.changes === 0) {
    response.status(404).send("Book Not Found");
  } else {
    response.status(200).send("Book Successfully Updated");
  }
});


// DELETE a book
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const deleteBookQuery = `
    DELETE FROM book
    WHERE id = ?;
  `;

  const result = await db.run(deleteBookQuery, [bookId]);

  if (result.changes === 0) {
    response.status(404).send("Book Not Found");
  } else {
    response.status(200).send("Book Successfully Deleted");
  }
});


// Start the application
initializeDBAndServer();