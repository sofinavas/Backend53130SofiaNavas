import mongoose from "mongoose";

const schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "premium"],
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  resetToken: {
    token: String,
    expire: Date,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("user", schema);

export default UserModel;
