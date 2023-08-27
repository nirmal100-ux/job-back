const express = require("express");
const jobController = require("../controller/jobController");
const userAuth = require("../middleware/UserAuth");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const routes = express.Router();

const fileCheck = require("../middleware/fileCheck");

const onlyPostMethod = (req, res) =>
  res.status(400).json({ status: 400, message: "Only POST Method allowed" });

const onlyGETMethod = (req, res) =>
  res.status(400).json({ status: 400, message: "Only GET Method allowed" });

const onlyPatchMethod = (req, res) =>
  res.status(400).json({ status: 400, message: "Only Patch Method allowed" });

// baseAPI

routes.get("/", jobController.updateJobStatus);

const addjobSchema = Joi.object().keys({
  jobTitle: Joi.string().required(),
  jobCategories: Joi.string().required(),
  jobType: Joi.string().required(),
  experience: Joi.string().required(),
  jobDescription: Joi.string().required(),
  salary: Joi.string().required(),
  qualification: Joi.string().required(),
  createdData: Joi.string().required(),
});

routes
  .route("/api/add-jobs")
  .post(validator.body(addjobSchema), userAuth.checkAdmin, jobController.addJob)
  .all(onlyPostMethod);

routes
  .route("/api/get-created-job")
  .get(userAuth.checkAdmin, jobController.getCreatedJob)
  .all(onlyGETMethod);

routes
  .route("/api/update-job")
  .patch(userAuth.checkAdmin, jobController.updateJob)
  .all(onlyPatchMethod);

routes
  .route("/api/delete-job")
  .post(userAuth.checkAdmin, jobController.deleteJob)
  .all(onlyPostMethod);

routes
  .route("/api/get-single-job/:jobID")
  .get(userAuth.checkAdmin, jobController.getSingleJobDetail)
  .all(onlyGETMethod);

// Clients API

routes
  .route("/api/get-categories-job")
  .get(jobController.getCategoryJob)
  .all(onlyGETMethod);

routes
  .route("/api/get-job-by-company")
  .get(jobController.getjobByCompany)
  .all(onlyGETMethod);

routes
  .route("/api/get-job-detail")
  .get(jobController.getJobDetail)
  .all(onlyGETMethod);

routes
  .route("/api/search-job")
  .get(jobController.getSearchedJob)
  .all(onlyGETMethod);

routes
  .route("/api/client/update-jobs")
  .patch(
    userAuth.checkClient,
    fileCheck.pdfCheck,
    jobController.getClientUpdateJob
  )
  .all(onlyPatchMethod);

module.exports = routes;
