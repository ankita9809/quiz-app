// Global imports
const router = require("express").Router();

const quiz = require("../controllers/quiz");

router.post("/submit-quiz", quiz.submitQuiz);
router.get("/view-score", quiz.viewScore);
// router.get("/view-result", quiz.viewResult);
// router.get("/get-response/:quizId?", quiz.getResponse);

module.exports = router;
