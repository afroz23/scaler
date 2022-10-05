const Users = require("../models/Users");
const Interview = require("../models/Interview");

exports.createUser = (req, res) => {
  let reqData = req.body;
  if (reqData.name) {
    let user = new Users(reqData);
    user.save((err, response) => {
      if (err) {
        return res.status(400).send("Invalid name");
      } else {
        return res.json(response);
      }
    });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
};
