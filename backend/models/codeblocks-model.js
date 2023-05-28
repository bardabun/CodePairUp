const mongoose = require("mongoose");

// Define the code block schema using Mongoose
const codeBlockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  code: { type: String, required: true },
  solution: { type: String, require: true },
});

// Create and export the CodeBlock model based on the schema
module.exports = mongoose.model("Codeblock", codeBlockSchema);
