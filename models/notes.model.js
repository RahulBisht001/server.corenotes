const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	branch: {
		type: String,
		required: true,
		enum: ["CSE", "IT", "ECE", "MECH", "EEE", "CIVIL", "OTHERS"],
		default: "CSE",
	},
	thumbnail: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const Notes = mongoose.model("Notes", NotesSchema);
module.exports = Notes;
