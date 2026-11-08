# Lab 3: REST API, Query Parameters and Validation

**Name:** Sasrika Peethani  
**Registration Number:** 252U1R1190  
**Section:** CSE CORE 2D

## Objective

The objective of this lab is to develop a RESTful API using Node.js, Express.js and SQLite. It includes search, sorting, filtering, pagination, input validation and proper HTTP status codes.

## Technologies Used

- Node.js
- Express.js
- SQLite
- Postman
- JavaScript

## Features Implemented

1. RESTful API endpoints using GET, POST, PUT and DELETE.
2. Search books using partial title matching.
3. Sorting books in ascending and descending order.
4. Pagination using limit and offset.
5. Filtering books using minimum and maximum prices.
6. POST request validation.
7. Proper HTTP status codes (200, 201, 400, 404 and 500).
8. Consistent JSON error messages.
9. Parameterized SQL queries.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /books | Get all books |
| GET | /books/:bookId | Get one book |
| POST | /books | Add a new book |
| PUT | /books/:bookId | Update a book |
| DELETE | /books/:bookId | Delete a book |

## Query Parameters

- search_q – Search books by title.
- order_by – Sort using title, author, price or pages.
- order – ASC or DESC.
- limit – Number of books to display.
- offset – Number of records to skip.
- min_price – Minimum book price.
- max_price – Maximum book price.

## Testing

All API endpoints were tested using Postman. Successful requests and failure cases were checked, including invalid input, missing records, search, sorting, filtering and pagination.

## Debugging Exercises

The following common errors were identified and fixed:

1. EADDRINUSE: Fixed the port conflict by stopping the existing server.
2. Wrong Import Path: Corrected the file path in the import statement.
3. No Such Table: Corrected the database table name from the incorrect name to `book`.
4. Missing Await: Added `await` to handle asynchronous database operations properly.

## How to Run

1. Install Node.js.
2. Install dependencies using `npm install`.
3. Start the server using `node server.js`.
4. Open Postman.
5. Test the API using `http://localhost:3000/books`.

## Conclusion

This lab helped me understand RESTful API development, query parameters, validation, pagination and debugging. I also learned how to handle errors and use appropriate HTTP status codes while working with SQLite.