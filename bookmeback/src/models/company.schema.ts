import mongoose from "mongoose";
const { Schema, model } = mongoose;

const companySchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyLogo: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  companyImages: {
    type: [String],
    default: [],
  },
  backGroundImage: {
    type: String,
    required: false,
  },
  aboutUsImage: {
    type: String,
    required: false,
  },
  experience: {
    type: String,
    required: false,
  },
  clientNumber: {
    type: String,
    required: false,
  },

  address: { type: String, required: true },
  addressDetailed: { type: String, required: false },
  city: { type: String, required: false },
  lat: { type: Number },
  lng: { type: Number },
  employees: [
    {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: [],
    },
  ],
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: [],
    },
  ],
  workingHours: {
    type: {
      monday: {
        open: String,
        close: String,
        closed: Boolean,
      },
      tuesday: {
        open: String,
        close: String,
        closed: Boolean,
      },
      wednesday: {
        open: String,
        close: String,
        closed: Boolean,
      },
      thursday: {
        open: String,
        close: String,
        closed: Boolean,
      },
      friday: {
        open: String,
        close: String,
        closed: Boolean,
      },
      saturday: {
        open: String,
        close: String,
        closed: Boolean,
      },
      sunday: {
        open: String,
        close: String,
        closed: Boolean,
      },
    },
    default: {},
  },
  lunchBreak: {
    start: String,
    end: String,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isActive: {
    type: Boolean,
    required: false,
  },
  templateNumber: {
    type: Number,
    required: true,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Company = model("Company", companySchema);
