const { StatusCodes } = require("http-status-codes");

const Notes = require("../models/notes.model");

const getAllNotesByFilter = async (req, res) => {
	try {
		const filter = req.params.filter || "computer-science";

		// console.log(Notes.schema);

		// Validate if the filter is a valid branch
		if (!Notes.schema.path("branch").enumValues.includes(filter)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: "Invalid branch filter",
				error:
					"Branch must be one of: " +
					Notes.schema.path("branch").enumValues.join(", "),
				data: null,
			});
		}

		const allNotesByFilter = await Notes.find({ branch: filter });

		console.log(allNotesByFilter);

		return res.status(StatusCodes.OK).json({
			success: true,
			message: "Notes fetched successfully",
			error: null,
			data: allNotesByFilter,
		});
	} catch (err) {
		console.error("Error fetching notes:", err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: "Failed to fetch notes",
			error: "Internal server error",
			data: null,
		});
	}
};

module.exports = {
	getAllNotesByFilter,
};
