const mongoose = require("mongoose");

async function connectDB(URI) {
	try {
		const { connection } = await mongoose.connect(URI, {
			autoIndex: true,
		});
		console.log(`Database connected successfully: ${connection.host}`);
	} catch (err) {
		console.error("MongoDB connection error:", err.message);
		process.exit(1);
	}
}

module.exports = { connectDB };
