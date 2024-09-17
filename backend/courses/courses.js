const courses = require("./courses.json");

module.exports = app => {
  console.log("Courses module ready");

  app.get("/api/adv", (req, res) => {
    const advId = req.query.advId;
    res.json(courses["courses"].find(adv => adv.key === advId));
  });

  app.post("/api/setAdvs", (req, res) => {
    const advs = req.body.body;
    courses["courses"] = advs;
    res.send("done");
  });

  app.get("/api/explore", (req, res) => {
    res.send(courses["courses"]);
  });
};
