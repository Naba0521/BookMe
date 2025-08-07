import { connect } from "mongoose";

export const connectToDataBase = async () => {
  await connect("mongodb+srv://naba:%40Pi26114@bookme.hbntwcq.mongodb.net/?retryWrites=true&w=majority&appName=BookMe");
  console.log("Connected mongodb database");
};
