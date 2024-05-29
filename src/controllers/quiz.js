// Global impports
const mongoose = require("mongoose");

// Local impports
const { Quiz } = require("../models/quiz");
const {
  clientErrorResponse,
  successResponse,
  serverErrorResponse,
} = require("../helpers/response");

exports.submitQuiz = async (req, res) => {
  try {
    if (
      !req.body.topics ||
      !Array.isArray(req.body.topics) ||
      !req.body.topics.length
    )
      return clientErrorResponse(res, "Select Topic/Topics!");

    req.body.userId = req.user._id;

    await Quiz.create(req.body);
    return successResponse(res, "Quiz added sucessfully!");
  } catch (error) {
    return serverErrorResponse(res, error);
  }
};

exports.viewScore = async (req, res) => {
  try {
    let getData = await Quiz.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          isDeleted: false,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $addFields: {
          topics: {
            $map: {
              input: "$topics",
              as: "topics",
              in: {
                $toObjectId: "$$topics",
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$topics",
        },
      },
      {
        $lookup: {
          from: "questionnaires",
          localField: "topics",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                questionSet: 1,
                _id: 0,
              },
            },
            {
              $unwind: {
                path: "$questionSet",
              },
            },
            {
              $project: {
                qId: "$questionSet._id",
                ans: "$questionSet.correctAnswer",
              },
            },
          ],
          as: "result",
        },
      },
      {
        $project: {
          response: 1,
          result: 1,
          _id: 1,
        },
      },
    ]);

    let count = 0;

    let response = getData[0].response;
    let abc = [];
    getData.map((e) => {
      abc.push(e.result);
    });
    let result = abc.flat();

    let resultData = new Map(
      result.map(({ qId, ans }) => [qId.toString(), ans])
    );

    for (let { questionId, option } of response) {
      if (
        resultData.has(questionId.toString()) &&
        resultData.get(questionId.toString()) === option
      ) {
        count++;
      }
    }

    await Quiz.updateOne(
      { _id: getData[0]._id },
      { score: count },
      { new: true }
    );

    return successResponse(res, "Quiz added sucessfully!", count);
  } catch (error) {
    return serverErrorResponse(res, error);
  }
};

exports.viewResult = async (req, res) => {
  try {
  } catch (error) {
    return serverErrorResponse(res);
  }
};

exports.getResponse = async (req, res) => {
  try {
  } catch (error) {
    return serverErrorResponse(res);
  }
};