const { CreateInterview, allInterviews } = require("../controlers/Interview");
const router = require("express").Router();

router.post("/interview/create", CreateInterview);

router.get("/interview/allinterview", allInterviews);

module.exports = router;
