const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required."],
    },
    sex: {
      type: String,
      required: [true, "Sex is required."],
      enum: ["Male", "Female", "Other"],
    },
    accountType: {
      type: String,
      required: [true, "Account Type is required."],
      enum: ["Parent Account", "Child Account"],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);