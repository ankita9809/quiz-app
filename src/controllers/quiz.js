// Global impports
const mongoose = require("mongoose");

// Local impports
const { Quiz } = require("../models/quiz");
const { Users } = require("../models/users");
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

    if (!getData.length)
      return clientErrorResponse(res, "Please Submit a Quiz!");

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

    let getRank = await Quiz.aggregate([
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

    for (let i = 0; i < getRank.length; i++) {
      getRank[i].rank = i + 1;

      await Users.updateOne(
        { _id: getRank[i]._id },
        { rank: getRank[i].rank },
        { new: true }
      );
    }

    return successResponse(res, "Quiz added sucessfully!", count);
  } catch (error) {
    console.log(error);
    return serverErrorResponse(res, error);
  }
};

exports.viewResponse = async (req, res) => {
  try {
    let aggPipe = [];

    if (req.params.quizId) {
      aggPipe.push({
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.quizId),
          isDeleted: false,
        },
      });
    } else {
      aggPipe.push(
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
        }
      );
    }

    aggPipe.push(
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
          ],
          as: "questionSet",
        },
      },
      {
        $project: {
          response: 1,
          questionSet: 1,
          score: 1,
        },
      }
    );

    let getData = await Quiz.aggregate(aggPipe);
    if (!getData.length) return clientErrorResponse(res, "No Data Available!");

    let response = getData[0].response;
    let abc = [];
    getData.map((e) => {
      abc.push(e.questionSet);
    });
    let questionSet = abc.flat();

    let feedbackResp = [];
    let pqr = questionSet.forEach((questionObj) => {
      let QS = questionObj.questionSet;
      let res = response.find(
        (resp) => resp.questionId.toString() === QS._id.toString()
      );

      if (res) {
        QS.optedAns = res.option;
        feedbackResp.push(QS);
      }
    });

    return successResponse(res, "Response Data", {
      resp: feedbackResp,
      score: getData[0].score,
    });
  } catch (error) {
    return serverErrorResponse(res);
  }
};

exports.viewResults = async (req, res) => {
  try {
    let getData = await Quiz.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          isDeleted: false,
        },
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
                topicName: 1,
                _id: 0,
              },
            },
          ],
          as: "questionSet",
        },
      },
      {
        $addFields: {
          topic: {
            $first: "$questionSet.topicName",
          },
        },
      },
      {
        $project: {
          _id: 1,
          topic: "$topic",
          score: "$score",
          total: {
            $size: "$response",
          },
          submittedOn: "$createdAt",
        },
      },
      {
        $group: {
          _id: "$submittedOn",
          data: {
            $push: "$$ROOT",
          },
          topic: {
            $push: "$topic",
          },
        },
      },
      {
        $project: {
          _id: {
            $first: "$data._id",
          },
          topic: "$topic",
          score: {
            $first: "$data.score",
          },
          total: {
            $first: "$data.total",
          },
          submittedOn: {
            $first: "$data.submittedOn",
          },
        },
      },
      {
        $sort: {
          submittedOn: -1,
        },
      },
    ]);
    if (!getData.length) return clientErrorResponse(res, "No Data Found!");
    return successResponse(res, "Result!", getData);
  } catch (error) {
    serverErrorResponse(res);
  }
};
