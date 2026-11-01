# Lab 2: SQLite Database and CRUD Routes

**Name:** Sasrika Peethani  
**Registration Number:** 252U1R1190
**Section:** CSE CORE 2D 

## Live Link

Not deployed yet.

## Objective

The objective of this lab is to connect an Express.js server to a SQLite database and perform CRUD operations using HTTP routes.

## Technologies Used

- Node.js
- Express.js
- SQLite
- Nodemon
- Postman

## How to Run

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npm start
```

The server runs at:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books/` | Get all books |
| GET | `/books/:bookId/` | Get one specific book |
| POST | `/books/` | Add a new book |
| PUT | `/books/:bookId/` | Update an existing book |
| DELETE | `/books/:bookId/` | Delete a book |

## Screenshots

### GET All Books

![GET All Books](screenshots/get-all-books.png)

### GET One Book

![GET One Book](screenshots/get-one-book.png)

### POST Book

![POST Book](screenshots/post-book.png)

### PUT Book

![PUT Book](screenshots/put-book.png)

### DELETE Book

![DELETE Book](screenshots/delete-book.png)

## Notes

While doing this lab, I faced an issue with using `await` outside an async function. I solved the issue by placing the database operations inside the `initializeDBAndServer()` async function. I also used parameterized queries with `?` placeholders to safely handle user input and help prevent SQL injection.