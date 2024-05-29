const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    topics: [],
    response: [
      {
        questionId: {
          type: mongoose.Types.ObjectId,
          default: null,
        },
        option: {
          type: String,
          default: "",
        },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

exports.Quiz = mongoose.model("Quiz", quizSchema);
