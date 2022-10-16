const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { checkData, imagesData, allKeywordsArray } = require("./server/checkData");
const AIImage = require("./server/AIImage");

checkData();

const app = express();
const port = 3000;

app.use(express.static("dist"));
app.use(express.static("images"));

app.get("/", (req, res) => {
  res.send("index.html");
});

app.get("/imagesData", (req, res) => {
  res.send(imagesData);
});

app.get("/allKeywords", (req, res) => {
  res.send(allKeywordsArray);
});

app.post("/novelAI/addImages", jsonParser, (req, res) => {
  let images = AIImage.addImages(req.body);
  res.send(images);
});

app.listen(port);
