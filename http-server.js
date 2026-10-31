const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("Hello");
});

server.listen(3001, () => {
    console.log("HTTP server running at http://localhost:3001");
});