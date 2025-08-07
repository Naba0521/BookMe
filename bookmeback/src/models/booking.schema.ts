import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  status: {
    type: String,
    enum: ["cancelled", "confirmed"],
    default: "confirmed",
  },
  selectedTime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: false,
    default: "нэмэлт мэдээлэл байхгүй."
  }
});
bookingSchema.index(
  { employee: 1, selectedTime: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "cancelled" } } }
);
export const Booking = model("Booking", bookingSchema);
