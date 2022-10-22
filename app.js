const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { checkImageDirs, getImagesData } = require("./server/image");

const app = express();
const port = 3000;

function initExpress(electronApp) {
  const STATIC_PATH = path.resolve(electronApp.getAppPath(), "./dist");
  let ROOT_PATH = electronApp.getAppPath();
  if (electronApp.isPackaged) {
    switch (process.platform) {
      case "darwin":
        ROOT_PATH = path.resolve(electronApp.getAppPath(), "../../../../");
        break;
      case "win32":
        ROOT_PATH = path.resolve(electronApp.getAppPath(), "../../");
        break;
    }
  }

  app.use(express.static(STATIC_PATH));

  app.use(express.static(path.resolve(ROOT_PATH, "./images")));

  app.get("/", (req, res) => {
    res.send("index.html");
  });

  app.get("/checkImageDirs", (req, res) => {
    res.send(checkImageDirs(ROOT_PATH));
  });

  app.post("/getImagesData", jsonParser, (req, res) => {
    res.send(getImagesData(ROOT_PATH, req.body));
  });

  app.listen(port);
}

module.exports = { initExpress };
