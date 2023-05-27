// const HttpError = require("../models/http-error");

// let DUMMY_CODEBLOCKS = [
//   {
//     id: "1",
//     title: "Empire State Building",
//     code: "console.log('Shut dafuck up!');",
//   },
// ];
// const getCodeBlockById = (req, res, next) => {
//   const codeBlockId = req.params.aid; // { aid: '1' }
//   const codeBlock = DUMMY_CODEBLOCKS.find((a) => {
//     return a.id === codeBlockId;
//   });

//   if (!codeBlock) {
//     throw new HttpError("Could not find a codeBlock for the provided id.", 404);
//   }

//   res.json({ codeBlock }); // => { codeBlock } => { codeBlock: codeBlock }
// };

// exports.getCodeBlockById = getCodeBlockById;

const HttpError = require("../models/http-error");
const CodeBlockModel = require("../models/codeblocks-model");

const getCodeBlockById = (req, res, next) => {
  const codeBlockId = req.params.aid;
  CodeBlockModel.findOne({ id: codeBlockId })
    .then((codeBlock) => {
      if (!codeBlock) {
        throw new HttpError(
          "Could not find a codeBlock for the provided id-> " + codeBlockId,
          404
        );
      }

      res.json({ codeBlock });
    })
    .catch((error) => {
      console.log(error);
      // next(
      //   new HttpError("Fetching codeBlock failed, please try again later.", 500)
      // );
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
