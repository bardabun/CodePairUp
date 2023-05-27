const express = require("express");

const codeBlocksControllers = require("../controllers/codeblocks-controllers");

const router = express.Router();

// router.get("/:aid", codeBlocksControllers.getCodeBlockById);
router.get("/", (req, res) => {
  console.log("Hey");
});

module.exports = router;
