
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
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.run(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      );
    `);

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

    const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

  } catch (error) {
    console.log("Database Error:", error.message);
    process.exit(1);
  }
};

// GET all books with search, sorting and filters
app.get("/books", async (request, response) => {
  try {
    const {
      search_q = "",
      order_by = "title",
      order = "ASC",
      limit = "10",
      offset = "0",
      min_price,
      max_price
    } = request.query;

    // Validate sorting column
    const allowedColumns = ["title", "author", "price", "pages"];

    if (!allowedColumns.includes(order_by)) {
      return response.status(400).send({
        message: "Invalid order_by value"
      });
    }

    const sortOrder = order.toUpperCase();

    if (!["ASC", "DESC"].includes(sortOrder)) {
      return response.status(400).send({
        message: "Order must be ASC or DESC"
      });
    }

    const limitValue = Number(limit);
    const offsetValue = Number(offset);

    if (
      !Number.isInteger(limitValue) ||
      limitValue <= 0 ||
      !Number.isInteger(offsetValue) ||
      offsetValue < 0
    ) {
      return response.status(400).send({
        message: "Limit must be positive and offset must be non-negative"
      });
    }

    const conditions = [];
    const values = [];

    // Search by partial book title
    if (search_q.trim() !== "") {
      conditions.push("title LIKE ?");
      values.push(`%${search_q}%`);
    }

    // Minimum price filter
    if (min_price !== undefined) {
      if (min_price.trim() === "" || !Number.isFinite(Number(min_price))) {
        return response.status(400).send({
          message: "min_price must be a valid number"
        });
      }

      conditions.push("price >= ?");
      values.push(Number(min_price));
    }

    // Maximum price filter
    if (max_price !== undefined) {
      if (max_price.trim() === "" || !Number.isFinite(Number(max_price))) {
        return response.status(400).send({
          message: "max_price must be a valid number"
        });
      }

      conditions.push("price <= ?");
      values.push(Number(max_price));
    }

    if (
      min_price !== undefined &&
      max_price !== undefined &&
      Number(min_price) > Number(max_price)
    ) {
      return response.status(400).send({
        message: "min_price cannot be greater than max_price"
      });
    }

    let sqlQuery = "SELECT * FROM book";

    if (conditions.length > 0) {
      sqlQuery += " WHERE " + conditions.join(" AND ");
    }

    sqlQuery += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;

    values.push(limitValue, offsetValue);

    const books = await db.all(sqlQuery, values);

    response.status(200).send(books);

  } catch (error) {
    response.status(500).send({
      message: "Failed to retrieve books"
    });
  }
});

// GET one book
app.get("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;

    const book = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [bookId]
    );

    if (!book) {
      return response.status(404).send({
        message: "Book Not Found"
      });
    }

    response.status(200).send(book);

  } catch (error) {
    response.status(500).send({
      message: "Failed to retrieve book"
    });
  }
});

// POST a new book with validation
app.post("/books", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof author !== "string" ||
      author.trim() === ""
    ) {
      return response.status(400).send({
        message: "Title and author are required"
      });
    }

    if (
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return response.status(400).send({
        message: "Price must be a valid non-negative number"
      });
    }

    const result = await db.run(
      `INSERT INTO book (title, author, price, pages)
       VALUES (?, ?, ?, ?)`,
      [title.trim(), author.trim(), price, pages ?? null]
    );

    response.status(201).send({
      message: "Book Successfully Added",
      id: result.lastID
    });

  } catch (error) {
    response.status(500).send({
      message: "Failed to add book"
    });
  }
});

// PUT update a book
app.put("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof author !== "string" ||
      author.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return response.status(400).send({
        message: "Valid title, author and price are required"
      });
    }

    const result = await db.run(
      `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?`,
      [title.trim(), author.trim(), price, pages ?? null, bookId]
    );

    if (result.changes === 0) {
      return response.status(404).send({
        message: "Book Not Found"
      });
    }

    response.status(200).send({
      message: "Book Successfully Updated"
    });

  } catch (error) {
    response.status(500).send({
      message: "Failed to update book"
    });
  }
});

// DELETE a book
app.delete("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;

    const result = await db.run(
      "DELETE FROM book WHERE id = ?",
      [bookId]
    );

    if (result.changes === 0) {
      return response.status(404).send({
        message: "Book Not Found"
      });
    }

    response.status(200).send({
      message: "Book Successfully Deleted"
    });

  } catch (error) {
    response.status(500).send({
      message: "Failed to delete book"
    });
  }
});

// Start application
initializeDBAndServer();
