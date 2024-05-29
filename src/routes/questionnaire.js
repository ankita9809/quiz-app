// Global imports
const router = require("express").Router();

const questionnaire = require("../controllers/questionnaire");

router.post("/add-questionnaire", questionnaire.addQuestionnaire);
router.get("/get-topics-list", questionnaire.getTopics);
router.post("/get-random-qns", questionnaire.getRandomQns);
router.get("/get-qns/:topic?", questionnaire.getQns);

module.exports = router;
