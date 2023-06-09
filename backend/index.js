const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const codeBlocksRoutes = require("./routes/codeblocks-routes");
const HttpError = require("./models/http-error");

const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/codeblocks/", codeBlocksRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });

    const io = require("socket.io")(server, {
      cors: {
        origin: "*", // Allow requests from all origins
        methods: ["GET", "POST", "PATCH", "DELETE"], // Allow specific HTTP methods
        allowedHeaders: [
          "Origin",
          "X-Requested-With",
          "Content-Type",
          "Accept",
          "Authorization",
        ], // Allow specific headers
      },
    });

    const connectedUsers = {};
    let isViewerUserConnected = false;
    let userRole;

    io.on("connection", (socket) => {
      console.log("Client Connected");

      if (!isViewerUserConnected) {
        socket.emit("userRole", "viewer"); // Emit "viewer" role to the first user
        isViewerUserConnected = true; // Mark the viewer user as connected
        userRole = "viewer";
      } else {
        socket.emit("userRole", "editor"); // Emit "editor" role to subsequent users
        userRole = "editor";
      }

      connectedUsers[socket.id] = userRole; // Store the user role

      // Listen for code updates from clients
      socket.on("codeUpdate", (updatedCode) => {
        if (isViewerUserConnected) {
          // Only allow the first user (editor) to update the code
          // Broadcast the updated code to all connected clients
          socket.broadcast.emit("codeUpdated", updatedCode);
        }
      });

      // Handle socket disconnection
      socket.on("disconnect", () => {
        const disconnectedUserRole = connectedUsers[socket.id]; // Get the role of the disconnected user
        delete connectedUsers[socket.id]; // Remove the disconnected user from the data structure

        if (isViewerUserConnected && disconnectedUserRole === "viewer") {
          isViewerUserConnected = false; // Reset isFirstUserConnected when the first user disconnects
        }
        console.log("Client Disconnected " + disconnectedUserRole);
      });
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

module.exports = app;
