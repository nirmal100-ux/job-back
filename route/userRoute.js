const express = require("express");
const userController = require("../controller/userController");
const routes = express.Router();
const userFileCheck = require("../middleware/fileCheck");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const userAuth = require("../middleware/UserAuth");

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(3),
});

const employee = Joi.object().keys({
  companyName: Joi.string().required(),
  companyDescription: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  password: Joi.string().required().min(3),
});

const clientSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(3),
});

const onlyPostMethod = (req, res) =>
  res.status(200).json({ status: 200, message: "Only POST Method allowed" });

const onlyPatchMethod = (req, res) =>
  res.status(400).json({ status: 400, message: "Only Patch Method allowed" });

routes
  .route("/api/register-employee")
  .post(
    validator.body(employee),
    userFileCheck.fileCheck,
    userController.signupEmployee
  )
  .all(onlyPostMethod);

routes
  .route("/api/register-client")
  .post(validator.body(clientSchema), userController.signupClient)
  .all(onlyPostMethod);

routes
  .route("/api/login")
  .post(validator.body(loginSchema), userController.userLogin)
  .all(onlyPostMethod);

routes.get(
  "/api/get-client-detail",
  userAuth.checkClient,
  userController.getClientDetail
);

routes
  .route("/api/client/update-User")
  .patch(userAuth.checkClient, userController.getClientUpdateUser)
  .all(onlyPatchMethod);

module.exports = routes;
