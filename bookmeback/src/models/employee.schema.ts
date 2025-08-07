import mongoose from "mongoose";
const { Schema, model } = mongoose;

const employeeSchema = new Schema({
  employeeName: {
    type: String,
    required: true,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  profileImage: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    required: false,
    default: true
  },
  duration: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    default: "09:00",
  },
  endTime: {
    type: String,
    required: true,
    default: "18:00",
  },
  lunchTimeStart: {
    type: String,
    required: true,
    default: "12:00",
  },
  lunchTimeEnd: {
    type: String,
    required: true,
    default: "13:00",
  },
});

export const Employee = model("Employee", employeeSchema);
