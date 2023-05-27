const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const codeBlocksRoutes = require("./routes/codeblocks-routes");
const HttpError = require("./models/http-error");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/codeblocks/", codeBlocksRoutes);

// app.listen(PORT, () => {
//   console.log(`Server listening at http://localhost:${PORT}`);
// });

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
  .connect(
    "mongodb+srv://bardabun:Bar0546651680@cluster0.trhsimw.mongodb.net/blocks?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    // const server = app.listen(5000, () => {
    //   console.log("Server started on port 5000");
    // });
    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });

    const io = require("socket.io")(server, {
      cors: {
        // origin: "*", // Allow requests from all origins
        origin: "https://code-pair-up-client.vercel.app/",
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

    let isFirstUserConnected = false;

    io.on("connection", (socket) => {
      console.log("Client Connected");

      if (!isFirstUserConnected) {
        socket.emit("userRole", "viewer"); // Emit "viewer" role to the first user
        isFirstUserConnected = true; // Mark the first user as connected
      } else {
        socket.emit("userRole", "editor"); // Emit "editor" role to subsequent users
      }

      // Listen for code updates from clients
      socket.on("codeUpdate", (updatedCode) => {
        if (isFirstUserConnected) {
          // Only allow the first user (editor) to update the code
          // Broadcast the updated code to all connected clients
          socket.broadcast.emit("codeUpdated", updatedCode);
        }
      });

      // Handle socket disconnection
      socket.on("disconnect", () => {
        if (isFirstUserConnected) {
          isFirstUserConnected = false; // Reset isFirstUserConnected when the first user disconnects
        }
        console.log("Client Disconnected");
      });
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
