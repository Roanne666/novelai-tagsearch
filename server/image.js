const fs = require("fs");
const path = require("path");

function checkImageDirs(ROOT_PATH) {
  const IMAGE_DIR = path.resolve(ROOT_PATH, "./images");

  let response = {
    isFirstUse: false,
    platform: process.platform,
    imageDirs: [],
  };
  if (!fs.existsSync(IMAGE_DIR)) {
    response.isFirstUse = true;

    if (process.platform !== "darwin") {
      fs.mkdirSync(IMAGE_DIR);
    }
  } else {
    fs.readdirSync(IMAGE_DIR, { withFileTypes: true }).forEach(function (dirent) {
      const FILE_PATH = path.join(IMAGE_DIR, dirent.name);
      if (dirent.isDirectory()) {
        response.imageDirs.push(FILE_PATH);
      }
    });
  }
  return response;
}

module.exports = { checkImageDirs };
