const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmployee: {
      type: Boolean,
      required: true,
    },
    appliedJob: [
      {
        jobID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      },
    ],
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
