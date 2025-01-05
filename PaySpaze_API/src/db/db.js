import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );

    console.log(
      "MONGODB CONNECTED !! DB HOST !!",
      connectInstance.connection.host
    );
  } catch (error) {
    console.log("ERROR :: MONGODB CONNECTION ERROR", error);
    process.exit(1);
  }
};

export default connectDB;
