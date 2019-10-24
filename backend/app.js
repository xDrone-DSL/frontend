const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 8081;

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// COURSES
const courses = require("./courses/courses.js")(app);

app.use("/", express.static(path.resolve("../dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve("../dist/index.html"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
