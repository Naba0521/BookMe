import { connect } from "mongoose";

export const connectToDataBase = async () => {
  const mongoUri =
    process.env.MONGODB_URI ||
    "mongodb+srv://naba:%40Pi26114@bookme.hbntwcq.mongodb.net/?retryWrites=true&w=majority&appName=BookMe";
  await connect(mongoUri);
  console.log("Connected mongodb database");
};
