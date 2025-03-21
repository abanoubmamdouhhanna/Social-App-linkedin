import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.DB) {
      throw new Error("Database connection string (DB) is missing in environment variables.");
    }

    const connection = await mongoose.connect(process.env.DB);
    console.log(`Database connected successfully: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1); // Exit the process if the database connection fails
  }
};

export default connectDB;
