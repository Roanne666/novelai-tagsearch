const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const { getImagesData } = require("./server/getImagesData");

function initExpress(electronApp) {
  const STATIC_PATH = path.resolve(electronApp.getAppPath(), "./dist");
  let ROOT_PATH = electronApp.getAppPath();
  if (electronApp.isPackaged) {
    ROOT_PATH = path.resolve(electronApp.getAppPath(), "../../../../");
  }

  app.use(express.static(STATIC_PATH));

  app.get("/", (req, res) => {
    res.send();
  });
  getImagesData(ROOT_PATH);
  app.get("/imagesData", (req, res) => {
    res.send(getImagesData(ROOT_PATH));
  });

  app.listen(port);
}

module.exports = { initExpress };
