let request = require("request");
let fs = require("fs");
const path = require("path");
const utils = require("./utils");

let imagesData = [];

checkDir();

function checkDir() {
  let imageDirPath = path.resolve(__dirname, "../public/images");
  if (!fs.existsSync(imageDirPath)) {
    fs.mkdirSync(imageDirPath);
  }
}

async function checkData(imagesJson = [], index = 0) {
  if (index >= imagesJson.length) {
    fs.writeFileSync(path.resolve(__dirname, "../src/assets/transImages.json"), JSON.stringify(imagesData));
    return console.log(`**图片下载完成,图片总数据量${imagesJson.length},可用数据量${imagesData.length}**`);
  }

  let imageData = imagesJson[index];

  // 屏蔽语雀链接(暂未解决)
  if (imageData.imageUrl.includes("yuque")) return checkData(imagesJson, index + 1);

  let { options, imageType } = utils.getOptions(imageData.imageUrl);
  if (options.headers.referer) {
    let splitArray = imageData.imageUrl.split("/");
    let lastString = splitArray[splitArray.length - 1];

    // 推特链接需要把「?」之后的字符串去掉，不然网页访问不了图片
    lastString = lastString.split(".jpg")[0].split(".png")[0].split("?")[0];
    console.log("正在检查:", lastString);
    let imagePath = path.resolve(__dirname, `../public/images/${lastString}.${imageType}`);
    imageData.imageUrl = `./images/${lastString}.${imageType}`;
    if (fs.existsSync(imagePath)) {
      imagesData.push(imageData);
      return checkData(imagesJson, index + 1);
    }

    if (!options.proxy) return checkData(imagesJson, index + 1);

    let status = await downImg(options, imagePath);
    if (!status) return checkData(imagesJson, index + 1);

    // 下载图片完成后添加图片数据
    imagesData.push(imageData);
    return setTimeout(() => {
      checkData(imagesJson, index + 1);
    }, Math.random() * 2000 + 1000);
  }
  imagesData.push(imageData);
  return checkData(imagesJson, index + 1);
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

function getAllKeywordsArray(imagesJson) {
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

module.exports = { checkData, imagesData, getAllKeywordsArray };
