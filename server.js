const http = require("http");
const express = require("express");
const socketIo = require("socket.io");

// Set up Express server
const app = express();
app.use(express.static(__dirname)); // Serve files from the root folder

// Start Express server
const webServer = http.createServer(app);
const io = socketIo(webServer);

// Handle new connections
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Broadcast user positions to everyone in the same scene
    socket.on("playerMove", (data) => {
        socket.broadcast.emit("updatePlayer", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server on port 8080
const port = process.env.PORT || 8080;
webServer.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});
