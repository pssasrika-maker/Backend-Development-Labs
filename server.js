const express = require("express");

const app = express();

const PORT = 3000;

// Home route
app.get("/", (req, res) => {
    res.status(200).send("Welcome to my Node.js and Express Server!");
});

// About route
app.get("/about", (req, res) => {
    res.status(200).json({
        name: "Sasrika Peethani",
        section: "YOUR SECTION"
    });
});

// Time route
app.get("/time", (req, res) => {
    res.status(200).send(new Date().toString());
});

// 404 route
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});