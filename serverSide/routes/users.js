var express = require("express");
var router = express.Router();
var fs = require("fs");
/* GET users listing. */
router.get("/", function (req, res, next) {
  let rawdata = fs.readFileSync("memeList.json");
  let student = JSON.parse(rawdata);
  res.json(student);
});

router.post("/", function (request, response) {
  if (!request.body) return response.sendStatus(400);

  fs.readFile("memeList.json", "utf8", function readFileCallback(err, data) {
    let obj = [];
    if (err) {
      console.log(err);
    } else {
      obj = JSON.parse(data); //now it an object
      obj.push({
        id: obj[obj.length-1].id + 1,
        name: request.body.body.name,
        link: request.body.body.link,
      }); //add some data
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile("memeList.json", json, (err) => {
        // Checking for errors
        if (err) throw err;

        console.log("Done writing"); // Success
      });
    }
  });
  response.send(request.body.body.name);
});

module.exports = router;
