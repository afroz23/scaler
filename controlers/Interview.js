const Interview = require("../models/Interview");
const Users = require("../models/Users");

exports.CreateInterview = async (req, res) => {
  const reqBody = req.body;

  if (!reqBody.title) {
    return res.status(400).send("Title is required");
  }

  if (reqBody.users.length < 2) {
    return res.status(400).send("Minimum 2 interviewee required");
  }

  const currentTime = new Date().getTime();

  if (!reqBody.startTime && !reqBody.endTime) {
    return res.status(400).send("start and end time is required");
  } else if (!reqBody.startTime) {
    return res.status(400).send("start time is required");
  } else if (!reqBody.endTime) {
    return res.status(400).send("end time is required");
  } else if (
    reqBody.startTime <= currentTime ||
    reqBody.endTime <= currentTime
  ) {
    return res.status(400).send("please choose future date");
  } else if (reqBody.startTime >= reqBody.endTime) {
    return res.status(400).send("start time must me greater than end time");
  }

  let start = reqBody.startTime;
  let end = reqBody.endTime;

  for (let i in reqBody.users) {
    const user = await Users.findById(reqBody.users[i]);
    for (let id in user.interviews) {
      let interview = await Interview.findById(user.interviews[id]);
      let currentStart = interview.startTime;
      let currentEnd = interview.endTime;
      if (Math.max(start, currentStart) < Math.min(end, currentEnd)) {
        return res.status(500).json({
          name: user.name,
          startTime: currentStart,
          endTime: currentEnd,
        });
      }
    }
  }

  const newinterview = new Interview(req.body);
  newinterview.save(async (err, result) => {
    if (err) {
      return res.send("Something went wrong!");
    } else {
      for (let id in reqBody.users) {
        let user = await Users.findById(reqBody.users[id]);
        user.interviews.push(result._id);
        user.save((err, result) => {
          if (err) {
            return res.send("Something went wrong!");
          }
        });
      }
      return res.send(result);
    }
  });
};

exports.allInterviews = async (req, res) => {
  let data = [];
  let user = await Interview.find({});
  for (let i = 0; i < user.length; i++) {
    let obj = {
      _id: user[i]._id,
      title: user[i].title,
      participants: [],
      startTime: user[i].startTime,
      endTime: user[i].endTime,
    };
    for (let j = 0; j < user[i].users.length; j++) {
      let value = await Users.findById(user[i].users[j]);
      obj.participants.push(value);
    }
    data = [...data, obj];
  }
  return res.json(data);
};

exports.UpdateInterview = async (req, res) => {
  const reqBody = req.body;
  if (!reqBody.title) {
    return res.status(400).send("Title is required");
  }

  if (reqBody.users.length < 2) {
    return res.status(400).send("Minimum 2 interviewee required");
  }

  const currentTime = new Date().getTime();
  if (!reqBody.startTime && !reqBody.endTime) {
    return res.status(400).send("start and end time is required");
  } else if (!reqBody.startTime) {
    return res.status(400).send("start time is required");
  } else if (!reqBody.endTime) {
    return res.status(400).send("end time is required");
  } else if (
    reqBody.startTime <= currentTime ||
    reqBody.endTime <= currentTime
  ) {
    return res.status(400).send("please choose future date");
  } else if (reqBody.startTime >= reqBody.endTime) {
    return res.status(400).send("start time must me greater than end time");
  }

  let start = reqBody.startTime;
  let end = reqBody.endTime;

  for (let i in reqBody.users) {
    const user = await Users.findById(reqBody.users[i]);
    for (let id in user.interviews) {
      let interview = await Interview.findById(user.interviews[id]);
      let currentStart = interview.startTime;
      let currentEnd = interview.endTime;
      if (Math.max(start, currentStart) < Math.min(end, currentEnd)) {
        return res.status(500).json({
          name: user.name,
          startTime: currentStart,
          endTime: currentEnd,
        });
      }
    }
  }

  const newinterview = await Interview.findById(req.params.id);
  if (req.body.title) newinterview.title = req.body.title;
  if (req.body.users) newinterview.users = req.body.users;
  if (req.body.startTime) newinterview.startTime = req.body.startTime;
  if (req.body.endTime) newinterview.endTime = req.body.endTime;
  await newinterview.save(async (err, result) => {
    if (err) {
      return res.send("Something went wrong!");
    } else {
      for (let id in req.body.users) {
        let user = await Users.findById(reqBody.users[id]);
        user.interviews.push(result._id);
        user.save((err, result) => {
          if (err) {
            return res.send("Something went wrong!");
          }
        });
      }
      return res.send(result);
    }
  });
};

exports.DeleteInterview = async (req, res) => {
  const { id } = req.body.params;
  const Delete = await Interview.deleteOne(id);

  res.status(200).send("user Deleted");
};