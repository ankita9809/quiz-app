const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema(
  {
    topicName: {
      type: String,
      default: "",
    },
    questionSet: [
      {
        question: {
          type: String,
          default: "",
        },
        optionOne: {
          type: String,
          default: "",
        },
        optionTwo: {
          type: String,
          default: "",
        },
        optionThree: {
          type: String,
          default: "",
        },
        optionFour: {
          type: String,
          default: "",
        },
        correctAnswer: {
          type: String,
          default: "",
        },
      },
    ],
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

exports.Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);
