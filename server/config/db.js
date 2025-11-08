import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`Mongo DB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Mongo DB Connection error:  ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
