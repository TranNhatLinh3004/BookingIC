const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo connected at", db.connection.host);
  } catch (error) {
    console.log("Error message", error);
  }
};
module.exports = connectDB;
