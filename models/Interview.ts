import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: "",
  },
  analysis: {
    score: {
      type: Number,
      default: 0,
    },
    technicalFeedback: String,
    communicationFeedback: String,
    improvementSuggestions: [String],
  },
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    questions: [questionSchema],
    overallScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
