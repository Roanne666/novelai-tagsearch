const fs = require("fs");
const path = require("path");
const ExifReader = require("exifreader");
const prettyBytes = require("pretty-bytes");
const extractChunks = require("png-chunks-extract");
const text = require("png-chunk-text");

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
      if (dirent.isDirectory()) {
        response.imageDirs.push(dirent.name);
      }
    });
  }
  return response;
}

function getImagesData(ROOT_PATH, settings) {
  const IMAGE_DIR = path.resolve(ROOT_PATH, "./images");
  let imagesData = [];

  fs.readdirSync(IMAGE_DIR, { withFileTypes: true }).forEach(function (dirent) {
    if (dirent.isDirectory()) {
      for (let imageDir of settings.imageDirs) {
        if (imageDir.selected && imageDir.dirName == dirent.name) {
          let DIR_PATH = path.resolve(IMAGE_DIR, `./${imageDir.dirName}`);
          fs.readdirSync(DIR_PATH).forEach(function (file) {
            if (path.extname(file) == ".png") {
              let FILE_PATH = path.resolve(DIR_PATH, `./${file}`);

              let fileStat = {
                name: file.split(".png")[0],
                size: fs.statSync(FILE_PATH).size,
              };

              let fileBuffer = fs.readFileSync(FILE_PATH);
              let exifInfo = readExif(fileBuffer);
              let fileInfo = readFileInfo(fileStat, fileBuffer);
              fileInfo.dirName = imageDir.dirName;
              fileInfo.imageUrl = `./${imageDir.dirName}/${file}`;
              imagesData.push(fileInfo);
            }
          });
        }
      }
    }
  });

  return imagesData;
}

function readNovelaiTag(fileBuffer) {
  const chunks = extractChunks(new Uint8Array(fileBuffer));
  const textChunks = chunks
    .filter(function (chunk) {
      return chunk.name === "tEXt" || chunk.name === "iTXt";
    })
    .map(function (chunk) {
      if (chunk.name === "iTXt") {
        let data = chunk.data.filter((x) => x != 0x0);
        let txt = new TextDecoder().decode(data);
        if (txt.includes("Description")) {
          return {
            keyword: "Description",
            text: txt.split("Description")[1],
          };
        }
        return {
          keyword: "info",
          text: txt,
        };
      }
      return text.decode(chunk.data);
    });
  return textChunks;
}

function readFileInfo(file, fileBuffer) {
  let nai = readNovelaiTag(fileBuffer);
  if (nai.length == 1) {
    nai = handleWebUiTag(nai[0]);
  }
  let fileInfoRef = [];
  let comment = [];
  fileInfoRef = [
    { key: "fileName", value: file.name },
    { key: "fileSize", value: prettyBytes(file.size) },
    ...nai.map((v, k) => {
      if (v.keyword == "Comment") {
        comment = JSON.parse(v.text);
        return {};
      } else {
        return {
          key: v.keyword.toLowerCase(),
          value: v.text,
        };
      }
    }),
  ];
  for (let key in comment) {
    fileInfoRef.push({ key, value: comment[key] });
  }

  if (nai.length == 0) {
    fileInfoRef.push({
      key: "tip",
      value: "这可能不是一张NovelAI生成的图或者不是原图, 经过了压缩",
    });
  }

  let fileInfo = {};
  fileInfoRef.forEach((v) => {
    if (v.key) {
      fileInfo[v.key] = v.value;
    }
  });

  return fileInfo;
}

function handleWebUiTag(data) {
  let parameters = data.text.split("Negative prompt: ")[0].split("parameters")[1];
  let otherSplit = data.text.split("Negative prompt: ")[1].split("Steps: ");
  let commentsString = `steps:${otherSplit[1]}}`;

  let dataArray = [
    {
      keyword: "description",
      text: parameters,
    },
    {
      keyword: "uc",
      text: otherSplit[0],
    },
    ...commentsString.split(",").map((comment) => {
      let [keyword, text] = comment.split(":");
      return { keyword: keyword.trim().toLowerCase(), text: text.trim() };
    }),
  ];
  return dataArray;
}

function readExif(fileBuffer) {
  let exifInfo = [];
  const data = ExifReader.load(fileBuffer);
  const entries = Object.entries(data);
  exifInfo = entries.map(([key, value]) => ({ key, value: value.description }));
  return exifInfo;
}

module.exports = { checkImageDirs, getImagesData };
