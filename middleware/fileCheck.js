module.exports.fileCheck = (req, res, next) => {
  const path = require("path");
  const fs = require("fs");
  try {
    if (req.files) {
      const { companyLogo } = req.files;
      const imageExtension = path.extname(companyLogo.name);
      const extension = [".png", ".jpg", ".jpeg"];
      if (extension.includes(imageExtension)) {
        companyLogo.mv(`./uploads/company/${companyLogo.name}`);
        req.CImage = `/uploads/company/${companyLogo.name}`;
        return next();
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "Unspported Image Format" });
      }
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Please add the company logo" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

module.exports.pdfCheck = (req, res, next) => {
  const path = require("path");
  const fs = require("fs");
  try {
    if (req.files) {
      const { CV } = req.files;

      const pdfExtension = path.extname(CV.name);

      if (pdfExtension === ".pdf") {
        CV.mv(`./uploads/jobs/${CV.name}`);
        req.CV = `/uploads/jobs/${CV.name}`;
        return next();
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "Unspported File Format" });
      }
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Please add the CV " });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};
