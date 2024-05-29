// Global imports
const router = require("express").Router();

const quiz = require("../controllers/quiz");

router.post("/submit-quiz", quiz.submitQuiz);
router.get("/view-score", quiz.viewScore);
router.get("/view-response", quiz.viewResponse);

//********************************************* RESULT SCREEN *********************************************//
router.get("/view-response/:quizId?", quiz.viewResponse);
router.get("/view-result-list", quiz.viewResults);

module.exports = router;
