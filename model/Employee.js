const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    companyDescription: {
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
    companyLogo: {
      type: String,
      default: "",
    },
    createdJobs: [
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

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
