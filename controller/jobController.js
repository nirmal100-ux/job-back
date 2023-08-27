const jobModel = require("../model/Job");
const mongoose = require("mongoose");
const userModel = require("../model/Employee");
const jwt = require("jsonwebtoken");
const addJob = async (req, res) => {
  const {
    jobTitle,
    jobCategories,
    jobType,
    experience,
    qualification,
    jobDescription,
    salary,
    createdData,
  } = req.body;

  try {
    const result = await jobModel.create({
      jobTitle,
      jobCategories,
      experience,
      jobType,
      qualification,
      salary,
      jobDescription,
      createdBy: req.employeeID,
      applicationDeadline: createdData,
    });

    if (result) {
      const userDetail = await userModel.findOne({ _id: req.employeeID });
      if (userDetail) {
        userDetail.createdJobs.push({
          jobID: result._id,
        });
        userDetail.save();
        res
          .status(201)
          .json({ status: "success", message: "Job Post Created" });
      }
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "Unable to create a job post" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const getCreatedJob = async (req, res) => {
  const idExist = mongoose.isValidObjectId(req.employeeID);
  try {
    if (idExist) {
      const result = await jobModel.find({ createdBy: req.employeeID });
      if (result) {
        return res.status(200).json({ status: "success", jobs: result });
      } else {
        return res
          .status(200)
          .json({ status: "success", message: "No jobs posted " });
      }
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "Inavlid User ID " });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const updateJob = async (req, res) => {
  const {
    jobID,
    jobTitle,
    jobCategories,
    jobType,
    experience,
    qualification,
    jobDescription,
    salary,
    createdData,
  } = req.body;

  try {
    const result = await jobModel.findOne({ _id: jobID });
    if (result) {
      result.jobTitle = jobTitle || result.jobTitle;

      result.jobCategories = jobCategories || result.jobCategories;
      result.jobType = jobType || result.jobType;
      result.experience = experience || result.experience;
      result.qualification = qualification || result.qualification;
      result.jobDescription = jobDescription || result.jobDescription;
      result.salary = salary || result.salary;
      result.applicationDeadline = createdData || result.applicationDeadline;
      result.save();
      return res
        .status(200)
        .json({ status: "success", message: "Job Post Updated" });
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "Unable to update Job Post" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const deleteJob = async (req, res) => {
  const { jobID } = req.body;
  try {
    const result = await jobModel.findByIdAndDelete({ _id: jobID });
    if (result) {
      const userDetail = await userModel.findOne({ _id: req.employeeID });

      if (userDetail) {
        let values = [];
        userDetail.createdJobs.forEach((d) => {
          if (d.jobID.toString() !== jobID.toString()) {
            values.push(d);
          }
        });

        userDetail.createdJobs = values;
        userDetail.save();
        return res
          .status(200)
          .json({ status: "success", message: "Deleted Succesfully" });
      }
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "Unable to delete the Job Post" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const getSingleJobDetail = async (req, res) => {
  try {
    const { jobID } = req.params;

    if (jobID) {
      const result = await jobModel.findById(jobID);
      if (result) {
        if (result.createdBy.toString() === req.employeeID) {
          return res.status(200).json({ status: "success", jobs: result });
        } else {
          return res
            .status(200)
            .json({ status: "error", message: "You are not authorized" });
        }
      } else {
        return res
          .status(200)
          .json({ status: "error", message: "Job Details Not Found" });
      }
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "Job Post ID is required" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

// Client Side API
const getCategoryJob = async (req, res) => {
  try {
    const { category } = req.query;
    if (category) {
      const result = await jobModel
        .find({ jobCategories: category, jobStatus: "Active" })
        .populate("createdBy", "address companyLogo companyName");
      if (result.length === 0) {
        return res
          .status(200)
          .json({ status: "error", message: "No Jobs added to this Category" });
      } else {
        return res.status(200).json({ status: "success", detail: result });
      }
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "Category name required" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const getjobByCompany = async (req, res) => {
  try {
    const companyDetail = await userModel
      .find({})
      .select("companyLogo companyName address")
      .populate("createdJobs.jobID");
    if (companyDetail) {
      let filteredData = [];
      companyDetail.forEach((company) => {
        if (company.createdJobs.length >= 1) {
          let temp = company;
          let jobData = [];
          company.createdJobs.forEach((data) => {
            if (data.jobID.jobStatus === "Active") {
              jobData.push(data);
            }
          });
          temp.createdJobs = jobData;
          filteredData.push(temp);
        }
      });
      if (filteredData) {
        return res
          .status(200)
          .json({ status: "success", details: filteredData });
      }
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "No Employees Created" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const getJobDetail = async (req, res) => {
  try {
    const { jobID } = req.query;
    const { clientToken } = req.query;
    let clientID;
    if (clientToken) {
      const decode = jwt.decode(clientToken, "tokencrypt");
      clientID = decode.userID;
    }

    if (jobID) {
      const result = await jobModel
        .findOne({ _id: jobID })
        .populate(
          "createdBy",
          "address companyLogo companyName companyDescription"
        );
      const status = result.appliedCandidate.find((data, index) => {
        return data.clientID.toString() === clientID;
      });
      if (status) {
        return res
          .status(200)
          .json({ status: "success", detail: result, appliedStatus: true });
      } else {
        return res
          .status(200)
          .json({ status: "success", detail: result, appliedStatus: false });
      }
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "Job Post ID is required" });
    }
  } catch (e) {
    return res.status(200).json({ status: "error", message: `${e}` });
  }
};

const getSearchedJob = async (req, res) => {
  try {
    const { jobTitle } = req.query;

    if (jobTitle) {
      const result = await jobModel
        .find({
          jobTitle: { $regex: `.*${jobTitle}.*`, $options: "i" },
          jobStatus: "Active",
        })
        .populate("createdBy", "companyName address  companyLogo");
      if (result.length !== 0) {
        return res.status(200).json({ status: "success", details: result });
      } else {
        return res.status(200).json({
          status: "error",
          message: "No Search Result Found",
        });
      }
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Job Title  required" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const getClientUpdateJob = async (req, res) => {
  const { fullName, jobID } = req.body;

  try {
    const result = await jobModel.findOne({ _id: jobID });

    if (result) {
      result.appliedCandidate.push({
        clientID: req.clientID,
        fullName: fullName,
        cv: req.CV,
      });
      result.save();

      return res
        .status(200)
        .json({ status: "success", message: "Job Applied" });
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "Unable to send the details" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const result = await jobModel.find({});

    result.map((data, index) => {
      const date = new Date(data?.applicationDeadline);
      const currentDate = new Date();
      if (currentDate.valueOf() >= date.valueOf()) {
        data.jobStatus = "Expired";
        data.save();
      } else {
        data.jobStatus = "Active";
        data.save();
      }
    });
    return res.status(200).json({
      status: "success",
      message: "Welcome to Job Portal API --- Created By Raj Shrestha",
    });
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

module.exports = {
  addJob,
  getCreatedJob,
  updateJob,
  deleteJob,
  getSingleJobDetail,
  getCategoryJob,
  getjobByCompany,
  getJobDetail,
  getSearchedJob,
  getClientUpdateJob,
  updateJobStatus,
};
