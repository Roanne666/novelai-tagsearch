const fs = require("fs");
const path = require("path");

function getImagesData(ROOT_PATH) {
  const IMAGE_DIR = path.resolve(ROOT_PATH, "./images");

  let response = {
    isFirstUse: false,
  };
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR);
    response.isFirstUse = true;
  } else {
    fs.readdirSync(IMAGE_DIR, { withFileTypes: true }).forEach(function (dirent) {
      var filePath = path.join(IMAGE_DIR, dirent.name);
      if (dirent.isDirectory()) {
        console.log(filePath);
      }
    });
  }
}

module.exports = { getImagesData };
