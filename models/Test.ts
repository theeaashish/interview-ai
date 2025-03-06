import mongoose, { Schema, Document } from "mongoose";

const TestSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    questions: [
      {
        question: String,
      },
    ],
    responses: [
      {
        type: String,
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Test = mongoose.model("Test", TestSchema);
export default Test;
