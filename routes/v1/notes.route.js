const express = require("express");
const notesRouter = express.Router();
const {
	getAllNotesByBranch,
	getNotesForSubject,
} = require("../../controllers/notes.controller");

// Default route
notesRouter.get("/", (req, res) => {
	res.json({ message: "List of notes" });
});

// Route with branch filter
notesRouter.get("/:branch", getAllNotesByBranch);
notesRouter.get("/:branch/:subject", getNotesForSubject);

module.exports = notesRouter;
