import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB)
    .then((result) => console.log(`DB connected successfully.....`))
    .catch((error) => console.log(`Fail to connect DB..`, error));
};
export default connectDB;
