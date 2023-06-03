const HttpError = require("../models/http-error");
const CodeBlockModel = require("../models/codeblocks-model");

// Middleware function to get a code block by its ID
const getCodeBlockById = (req, res, next) => {
  const codeBlockId = req.params.aid;
  CodeBlockModel.findOne({ id: codeBlockId })
    .then((codeBlock) => {
      // If code block is not found, throw an HTTP error.
      if (!codeBlock) {
        throw new HttpError(
          "Could not find a codeBlock for the provided id-> " + codeBlockId,
          404
        );
      }
      // Return the code block as a response
      res.json({ codeBlock });
    })
    .catch((error) => {
      console.log(error);
      // next(
      //   new HttpError("Fetching codeBlock failed, please try again later.", 500)
      // );

      // Handle the error and return a default code block with an error message
      return res.status(500).json({
        codeBlock: {
          id: "0",
          title: "We have some error",
          code: "No code bro.. error fetching the codeblock",
          solution: "bla bla",
        },
      });
    });
};

exports.getCodeBlockById = getCodeBlockById;
