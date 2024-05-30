// Global imports
const router = require("express").Router();

const leaderboard = require("../controllers/leaderboard");

router.get("/view-scores", leaderboard.viewScore);

module.exports = router;
