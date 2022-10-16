const fs = require("fs");
const path = require("path");
const AIIMAGE_PATH = path.resolve(__dirname, "../data/AIImages.json");

class AIImage {
  constructor(keywordsArray, negativeKeywordsArray, imageUrl) {
    this.keywordsArray = keywordsArray;
    this.negativeKeywordsArray = negativeKeywordsArray;
    this.imageUrl = imageUrl;
  }

  static images = [];

  static addImage(image) {
    this.images.push(image);
    fs.writeFileSync(AIIMAGE_PATH, JSON.stringify(this.images));
    return true;
  }

  static imageExist(imageUrl) {
    for (let image of this.images) {
      if (image.imageUrl == imageUrl) {
        return true;
      }
    }
  }

  static checkImages() {
    for (let image of this.images) {
      if (!image.negativeKeywordsArray) {
        image.negativeKeywordsArray = [];
      }
      for (let i in image.negativeKeywordsArray) {
        let keyword = image.negativeKeywordsArray[i];
        while (keyword.includes("{")) {
          keyword = keyword.replace("{", "");
        }
        while (keyword.includes("}")) {
          keyword = keyword.replace("}", "");
        }
        keyword = keyword.trim();
        image.negativeKeywordsArray[i] = keyword;
      }
      for (let i in image.keywordsArray) {
        let keyword = image.keywordsArray[i];
        while (keyword.includes("{")) {
          keyword = keyword.replace("{", "");
        }
        while (keyword.includes("}")) {
          keyword = keyword.replace("}", "");
        }
        keyword = keyword.trim();
        image.keywordsArray[i] = keyword;
      }
    }
    console.log("check pass");
    fs.writeFileSync(AIIMAGE_PATH, JSON.stringify(this.images));
  }
}

if (!fs.existsSync(AIIMAGE_PATH)) {
  fs.writeFileSync(AIIMAGE_PATH, "[]");
}
let data = fs.readFileSync(AIIMAGE_PATH);
AIImage.images = JSON.parse(data);
AIImage.checkImages();

module.exports = {
  getAllImages() {
    return AIImage.images;
  },
  addImages(data) {
    for (let imageUrl of data.imageUrlsArray) {
      if (!AIImage.imageExist(imageUrl)) {
        let image = new AIImage(data.keywordsArray, data.negativeKeywordsArray, imageUrl);
        AIImage.addImage(image);
        console.log(`成功添加图片，链接为${imageUrl}`);
      }
    }
    return AIImage.images;
  },
};
