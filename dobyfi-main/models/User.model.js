const { Schema, model, Types } = require("mongoose");

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
    parentAccount: {
      type: Boolean,
      required: [true, "Account Type is required."],
    },
    childAccount: {
      type: Boolean,
      required: [true, "Account Type is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    balance: {
      type: Number,
      required: [true, "Balance is required."], 
    },
    
    relative:{ type: Schema.Types.ObjectId, ref: 'User' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
    
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);