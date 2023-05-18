const { Schema, model, Types } = require("mongoose");
const { User } = require("./User.model.js");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required."],
      trim: true,
    },
    validated: {
      type: Boolean,
    },
    confirmed: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Task", taskSchema);
