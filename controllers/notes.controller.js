const { StatusCodes } = require("http-status-codes");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const Notes = require("../models/notes.model");
const notesS3Client = require("../utils/s3Client");

const getAllNotesByBranch = async (req, res) => {
	try {
		const branch = req.params.branch || "computer-science";

		// Validate branch
		if (!Notes.schema.path("branch").enumValues.includes(branch)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				success: false,
				message: "Invalid branch filter",
				error:
					"Branch must be one of: " +
					Notes.schema.path("branch").enumValues.join(", "),
				data: null,
			});
		}

		const allNotesByBranch = await Notes.find({ branch });
		return res.status(StatusCodes.OK).json({
			success: true,
			message: "Notes fetched successfully",
			error: null,
			data: allNotesByBranch,
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

const getNotesForSubject = async (req, res) => {
	try {
		// TODO : Check for Logged in user and Payment status

		const { branch, subject } = req.params;

		const key = `${branch}/${subject}`;
		const command = new GetObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET,
			Key: key,
		});

		const s3Response = await notesS3Client.send(command);

		// Set response headers for PDF streaming
		res.setHeader("Content-Type", "application/pdf");

		// Handle stream errors
		s3Response.Body.on("error", (streamErr) => {
			console.error("Error streaming PDF from S3:", streamErr);
			if (!res.headersSent) {
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Stream error");
			}
		});

		// Pipe the S3 stream directly to the client
		s3Response.Body.pipe(res);

		// Optionally handle the end event if needed
		s3Response.Body.on("end", () => {
			console.log(`Successfully streamed ${branch}/${subject}`);
		});
	} catch (err) {
		console.error("Error fetching notes for subject:", err);

		// Handle S3-specific errors
		if (err.code === "NoSuchKey") {
			return res.status(StatusCodes.NOT_FOUND).json({
				success: false,
				message: `PDF not found for ${branch}/${subject}`,
				error: err.message,
				data: null,
			});
		}

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: "Failed to fetch notes for subject",
			error: err.message,
			data: null,
		});
	}
};

module.exports = {
	getAllNotesByBranch,
	getNotesForSubject,
};
