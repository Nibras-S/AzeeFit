const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
    required: true,
  },
  sentCount: {
    type: Number,
    default: 0,
  },
  messageStatus: {
    type: String,
    enum: ["Sent", "Failed", "Pending"],
    default: "Pending",
  },
  lastSentAt: {
    type: Date,
  },
  nextSendDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
