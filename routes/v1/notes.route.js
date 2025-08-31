const express = require("express");
const notesRouter = express.Router();
const { getAllNotesByFilter } = require("../../controllers/notes.controller");

// Default route
notesRouter.get("/", (req, res) => {
	res.json({ message: "List of notes" });
});

// Route with branch filter
notesRouter.get("/:filter", getAllNotesByFilter);

module.exports = notesRouter;
