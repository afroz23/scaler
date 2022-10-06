const {
  CreateInterview,
  UpdateInterview,
  allInterviews,
} = require("../controlers/Interview");
const router = require("express").Router();

router.post("/interview/create", CreateInterview);

router.get("/interview/allinterview", allInterviews);

router.put("/interview/edit/:id", UpdateInterview);
module.exports = router;
