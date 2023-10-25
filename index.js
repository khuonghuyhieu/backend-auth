const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
// import routes
const authRoute = require("./routes/auth");

//DESTRUCTURE ENV VARIABLES WITH DEFAULT VALUES
dotenv.config();
const { PORT = 3000, DATABASE_URL } = process.env;

// Create Application Object
const app = express();

mongoose.connect(DATABASE_URL).then(() => {
  console.log("🚀 Connected to MongoDB");
});

// for the FE not error CORS when call API
app.use(cors());
// to use cookie
app.use(cookieParser());
// to all request at json
app.use(express.json());

//Routes
app.use("/v1/auth", authRoute);

app.listen(PORT, () => console.log("🚀 Server is Running"));
