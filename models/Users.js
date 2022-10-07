const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  interviews: [
    {
      type: ObjectId,
      ref: "Interview",
    },
  ],
});

module.exports = mongoose.model("Users", UsersSchema);
