// Global impports
const mongoose = require("mongoose");

// Local impports
const { Quiz } = require("../models/quiz");
const {
  clientErrorResponse,
  successResponse,
  serverErrorResponse,
} = require("../helpers/response");
const { login } = require("./auth");

exports.getRank = async (req, res) => {
  try {
    return successResponse(res, "Rank!");
  } catch (error) {
    return serverErrorResponse(res, error);
  }
};

exports.viewScore = async (req, res) => {
  try {
    let getData = await Quiz.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
                _id: 0,
              },
            },
          ],
          as: "data",
        },
      },
      {
        $group: {
          _id: "$userId",
          score: {
            $push: "$score",
          },
          name: {
            $first: "$data.name",
          },
        },
      },
      {
        $project: {
          name: {
            $first: "$name",
          },
          totalQuiz: {
            $size: "$score",
          },
          totalScore: {
            $sum: "$score",
          },
        },
      },
      {
        $sort: {
          totalScore: -1,
        },
      },
    ]);

    for (let i = 0; i < getData.length; i++) {
      getData[i].rank = i + 1;
    }

    return successResponse(res, "User Scores List!", getData);
  } catch (error) {
    return serverErrorResponse(res, error);
  }
};
