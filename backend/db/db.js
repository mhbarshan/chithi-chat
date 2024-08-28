import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectToMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`Connected to MongoDB : ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

export default connectToMongo;
