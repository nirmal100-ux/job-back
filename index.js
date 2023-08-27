const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./route/userRoute");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const jobRoute = require("./route/jobRoute");

mongoose
  .connect(
    "mongodb+srv://sthaleo12:ABC123@cluster0.gfavfmd.mongodb.net/jobportal"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((e) => {
    console.log(e);
  });

app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
    createParentPath: true,
    abortOnLimit: true,
  })
);

app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static("uploads/jobs"));

app.use(userRoute);
app.use(jobRoute);
