let request = require("request");
let fs = require("fs");
const path = require("path");
const utils = require("./utils");

const TRANSIMAGES_PATH = path.resolve(__dirname, "../src/assets/transImages.json");
const IMAGE_DIR = path.resolve(__dirname, "../public/images");

let imagesJson = require("../data/AIImages.json");
let imagesData = [];
let allKeywordsArray = getAllKeywordsArray();

checkDir();

function checkDir() {
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR);
  }
}

async function checkData(index = 0) {
  if (index >= imagesJson.length) {
    fs.writeFileSync(TRANSIMAGES_PATH, JSON.stringify(imagesData));
    return console.log("**资源下载完成，可以顺利打开网页**");
  }
  let imageData = imagesJson[index];

  if (imageData.imageUrl.includes("yuque")) return checkData(index + 1);
  let { options, imageType } = utils.getOptions(imageData.imageUrl);
  if (options.headers.referer) {
    let splitArray = imageData.imageUrl.split("/");
    let lastString = splitArray[splitArray.length - 1];
    lastString = lastString.split(".jpg")[0];
    lastString = lastString.split(".png")[0];
    console.log("正在检查:", lastString);
    lastString = encodeURI(lastString);
    let imagePath = path.resolve(IMAGE_DIR, `./${lastString}.${imageType}`);
    imageData.imageUrl = `./images/${lastString}.${imageType}`;
    if (fs.existsSync(imagePath)) {
      imagesData.push(imageData);
      return checkData(index + 1);
    }

    if (!options.proxy) return checkData(index + 1);

    let status = await downImg(options, imagePath);
    if (!status) return checkData(index + 1);

    return setTimeout(async () => {
      checkData(index + 1);
    }, Math.random() * 2000 + 1000);
  }
  imagesData.push(imageData);
  return checkData(index + 1);
}

function downImg(options, path) {
  return new Promise((resolve, reject) => {
    request(options)
      .pipe(fs.createWriteStream(path))
      .on("close", function (err) {
        if (err) throw err;
        resolve(true);
      });
  });
}

function getAllKeywordsArray() {
  let data = [];
  for (let imageData of imagesJson) {
    for (let keyword of imageData.keywordsArray) {
      let lowerKeyword = keyword.toLowerCase();
      if (!data.includes(lowerKeyword)) {
        data.push(lowerKeyword);
      }
    }
  }
  return data;
}

module.exports = { checkData, imagesData, allKeywordsArray };
