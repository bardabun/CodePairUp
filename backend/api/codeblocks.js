const express = require("express");

const codeBlocksControllers = require("../controllers/codeblocks-controllers");

const router = express.Router();

// router.get("/:aid", codeBlocksControllers.getCodeBlockById);
router.get("/", codeBlocksControllers.getCodeBlockById);

module.exports = router;
