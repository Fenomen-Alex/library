const mongoose = require("mongoose");

const mongooseOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

// Connect to the database and handle connection events for debugging
mongoose.connect(process.env.DB, mongooseOptions)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose; // Export the mongoose instance
