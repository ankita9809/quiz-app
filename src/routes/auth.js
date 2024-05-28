// Global imports
const router = require("express").Router();

const auth = require("../controllers/auth");

router.post("/signin", auth.signin);
router.post("/login", auth.login);

// router.post("/verify-token", auth.verifyToken);

module.exports = router;
