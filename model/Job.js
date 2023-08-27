const mongoose = require("mongoose");

const appliedUser = mongoose.Schema({
  clientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  fullName: {
    type: String,
    required: true,
  },
  appliedDate: {
    type: Date,
    default: new Date(),
  },
  cv: {
    type: String,
    required: true,
  },
});

const jobSchema = mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobCategories: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    jobStatus: {
      type: String,
      default: "Active",
    },

    salary: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    applicationDeadline: {
      type: Date,
    },
    appliedCandidate: [appliedUser],
  },
  { timestamps: true }
);

const job = mongoose.model("Job", jobSchema);

module.exports = job;
