const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const path = require("path");
let imagesJson = require(path.resolve(__dirname, "./data/AIImages.json"));
const AIImage = require("./server/AIImage");
let { checkData, imagesData, getAllKeywordsArray } = require("./server/checkData");

checkData(imagesJson);

const app = express();
const port = 3000;

app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.send("index.html");
});

app.get("/imagesData", (req, res) => {
  res.send(imagesData);
});

app.get("/allKeywords", (req, res) => {
  res.send(getAllKeywordsArray(imagesJson));
});

app.post("/novelAI/addImages", jsonParser, (req, res) => {
  let newImages = AIImage.addImages(req.body);
  checkData(newImages);
  res.send(true);
});

app.post("/switchR18", jsonParser, (req, res) => {
  let status = AIImage.switchR18(req.body.imageUrl);
  res.send(status);
});

app.listen(port);
