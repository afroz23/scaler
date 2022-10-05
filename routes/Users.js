const router = require("express").Router();

const { createUser, allUsers } = require("../controlers/Users");

router.post("/user/create", createUser);
router.get("/users", allUsers);

module.exports = router;
