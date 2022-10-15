const express = require("express");
const { checkData, imagesData, allKeywordsArray } = require("./server/checkData");

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

app.listen(port);
