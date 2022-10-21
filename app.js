const express = require("express");
const path = require("path");
const { checkImageDirs } = require("./server/image");

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
      default:
        break;
    }
  }

  app.use(express.static(STATIC_PATH));

  app.get("/", (req, res) => {
    res.send("index.html");
  });

  app.get("/checkImageDirs", (req, res) => {
    res.send(checkImageDirs(ROOT_PATH));
  });

  app.listen(port);
}

module.exports = { initExpress };
