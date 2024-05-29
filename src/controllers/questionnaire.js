// Global impports
const mongoose = require("mongoose");

// Local impports
const { Questionnaire } = require("../models/questionnaire");
const {
  clientErrorResponse,
  successResponse,
  serverErrorResponse,
} = require("../helpers/response");

exports.addQuestionnaire = async (req, res) => {
  try {
    if (!req.body.topicName)
      return clientErrorResponse(res, "Provide Topic Name");

    await Questionnaire.create(req.body);
    return successResponse(res, "Questionnaire added sucessfully!");
  } catch (error) {
    return serverErrorResponse(res, error);
  }
};

exports.getTopics = async (req, res) => {
  try {
    let getData = await Questionnaire.find(
      { isDeleted: false },
      { _id: 1, topicName: 1 }
    );
    if (!getData) return clientErrorResponse(res, "Data not found!");

    return successResponse(res, "Topics List", getData);
  } catch (error) {
    return serverErrorResponse(res, error);
  }
};

exports.getRandomQns = async (req, res) => {
  try {
    if (
      !req.body.topics ||
      !Array.isArray(req.body.topics) ||
      !req.body.topics.length
    )
      return clientErrorResponse(res, "Select Topics!");

    if (req.body.topics.length <= 1)
      return clientErrorResponse(res, "Select Minimum Two Topics!");

    req.body.topics = req.body.topics.map(
      (e) => new mongoose.Types.ObjectId(e)
    );

    let getData = await Questionnaire.aggregate([
      {
        $match: {
          _id: {
            $in: req.body.topics,
          },
          isDeleted: false,
        },
      },
      {
        $unwind: {
          path: "$questionSet",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: "$questionSet._id",
          question: "$questionSet.question",
          optionOne: "$questionSet.optionOne",
          optionTwo: "$questionSet.optionTwo",
          optionThree: "$questionSet.optionThree",
          optionFour: "$questionSet.optionFour",
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    return successResponse(res, "Questionnaire!", getData);
  } catch (error) {
    return serverErrorResponse(res, error);
  }
};

exports.getQns = async (req, res) => {
  try {
    if (!req.params.topic) return clientErrorResponse(res, "Select Topic!");
    if (!mongoose.isValidObjectId(req.params.topic))
      return clientErrorResponse(res, "Invalid Topic Selection!");

    let getData = await Questionnaire.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.topic),
          isDeleted: false,
        },
      },
      {
        $unwind: {
          path: "$questionSet",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          question: "$questionSet.question",
          optionOne: "$questionSet.optionOne",
          optionTwo: "$questionSet.optionTwo",
          optionThree: "$questionSet.optionThree",
          optionFour: "$questionSet.optionFour",
        },
      },
    ]);

    return successResponse(res, "Questionnaire", getData);
  } catch (error) {
    return serverErrorResponse(res, error);
  }
};
