// Global imports
const router = require("express").Router();

const auth = require("../controllers/auth");
const { secureAuth } = require("../middleware/checkToken");

router.post("/signin", auth.signin);
router.post("/login", auth.login);
router.get("/get-user-info", secureAuth, auth.getUser);

module.exports = router;
