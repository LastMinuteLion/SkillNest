import mongoose, { Schema } from "mongoose";

// Define the schema
const subSectionSchema = new Schema(
  {
    title: {
      type: String,
    },
    timeDuration: {
      type: String,
    },
    description: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists before defining it
export const SubSection = mongoose.model("SubSection", subSectionSchema);
