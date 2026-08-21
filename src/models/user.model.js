const mongoose = require('mongoose');
const { ROLES } = require('../constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // nunca se devuelve por defecto en queries
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
