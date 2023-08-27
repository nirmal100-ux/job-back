const employee = require("../model/Employee");
const client = require("../model/Client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupEmployee = async (req, res) => {
  const { companyName, email, address, companyDescription, password } =
    req.body;

  try {
    const employeeUserExist = await employee.find({ email });
    const clientUserExist = await client.find({ email });
    if (employeeUserExist.length !== 0 || clientUserExist.length !== 0) {
      return res.status(200).json({
        status: "error",
        message: "Email already Registered. Use different email",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await employee.create({
        companyName,
        email,
        companyDescription,
        address,
        companyLogo: req.CImage,
        password: hashedPassword,
        isEmployee: true,
      });
      if (result) {
        return res
          .status(201)
          .json({ status: "success", message: "Employee Registered" });
      } else {
        return res
          .status(200)
          .json({ status: "error", message: "Unable to Register" });
      }
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const signupClient = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const employeeUserExist = await employee.find({ email });
    const clientUserExist = await client.find({ email });

    if (employeeUserExist.length !== 0 || clientUserExist.length !== 0) {
      return res.status(200).json({
        status: "error",
        message: "Email already Registered. Use different email",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await client.create({
        fullName,
        email,
        password: hashedPassword,
        isEmployee: false,
      });
      if (result) {
        return res
          .status(201)
          .json({ status: "success", message: "User Registered" });
      } else {
        return res
          .status(200)
          .json({ status: "error", message: "Unable to Register" });
      }
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const employeeUserExist = await employee.find({ email });
    const clientUserExist = await client.find({ email });
    if (employeeUserExist.length !== 0) {
      const matchPassword = bcrypt.compareSync(
        password,
        employeeUserExist[0].password
      );
      if (matchPassword) {
        const token = jwt.sign(
          {
            userID: employeeUserExist[0]._id,
            isEmployee: employeeUserExist[0].isEmployee,
          },
          "tokencrypt"
        );
        return res.status(200).json({
          status: "success",
          users: {
            token,
          },
          isEmployee: employeeUserExist[0].isEmployee,
        });
      } else {
        return res
          .status(200)
          .json({ status: "error", message: "Invalid Login Credential" });
      }
    } else if (clientUserExist.length !== 0) {
      const matchPassword = bcrypt.compareSync(
        password,
        clientUserExist[0].password
      );
      if (matchPassword) {
        const token = jwt.sign(
          {
            userID: clientUserExist[0]._id,
            isEmployee: clientUserExist[0].isEmployee,
          },
          "tokencrypt"
        );
        return res.status(200).json({
          status: "success",
          users: {
            token,
          },
          isEmployee: clientUserExist[0].isEmployee,
        });
      } else {
        return res
          .status(200)
          .json({ status: "error", message: "Invalid Login Credential" });
      }
    } else {
      return res
        .status(200)
        .json({ status: "error", message: "User is not registered" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const getClientDetail = async (req, res) => {
  try {
    const result = await client
      .findOne({ _id: req.clientID })
      .populate("appliedJob.jobID");
    return res.status(200).json({ status: "success", details: result });
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

const getClientUpdateUser = async (req, res) => {
  const { jobID } = req.body;

  try {
    const userData = await client.findOne({ _id: req.clientID });
    if (userData) {
      userData.appliedJob.push({
        jobID: jobID,
      });
      userData.save();
      return res
        .status(200)
        .json({ status: "success", message: "User Updated " });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

module.exports = {
  signupEmployee,
  signupClient,
  userLogin,
  getClientDetail,
  getClientUpdateUser,
};
