const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const InterviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  users: [
    {
      type: ObjectId,
      required: true,
      ref: "Users",
    },
  ],
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Interview", InterviewSchema);
