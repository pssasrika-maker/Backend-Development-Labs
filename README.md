# Lab 1: Node.js and Express Server

**Name:** Sasrika Peethani  
**Registration Number:** 252U1R1190  
**Section:** CSE CORE 2D 

## Live Link

Not deployed yet.

## Objective

The objective of this lab is to understand the basics of Node.js and Express.js by creating a simple web server and implementing different routes.

## Technologies Used

- Node.js
- Express.js
- JavaScript

## How to Run

### 1. Install Node.js

Make sure Node.js and npm are installed.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
node server.js
```

The server will run at:

```text
http://localhost:3000
```

## Environment Variables

No environment variables are required for this project.

## Endpoints

| Method | Path | Description | Status Code |
|--------|------|-------------|-------------|
| GET | `/` | Returns a welcome message | 200 |
| GET | `/about` | Returns name and section in JSON format | 200 |
| GET | `/time` | Returns the current date and time | 200 |
| GET | Unknown path | Returns a Page Not Found message | 404 |

## Screenshots

### Home Route

![Home Route](screenshots/home.png)

### About Route

![About Route](screenshots/about.png)

### Time Route

![Time Route](screenshots/time.png)

### 404 Route

![404 Route](screenshots/404.png)

## Problems Faced and Solutions

Initially, Node.js was not installed on the system, so the `node` and `npm` commands were not recognized. After installing Node.js, PowerShell blocked the npm script due to the execution policy. This was solved by using `npm.cmd`.

I also learned how to create routes using Express and return appropriate status codes for valid and invalid routes.

## Conclusion

This lab helped me understand the fundamentals of Node.js and Express.js, including creating a server, defining routes, sending JSON and text responses, and handling unknown routes with a 404 status code.