import { connect } from "mongoose";

export const connectToDataBase = async () => {
  const mongoUri =
    process.env.MONGODB_URI ||
    "mongodb+srv://naba:%40Pi26114@cluster0.cgzjdlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  await connect(mongoUri);
  console.log("Connected mongodb database");
};
