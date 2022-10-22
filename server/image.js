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

async function getImagesData(ROOT_PATH, settings) {
  const IMAGE_DIR = path.resolve(ROOT_PATH, "./images");
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
              let exifRef = readExif(fileBuffer);
              let fileInfoRef = readFileInfo(fileStat, fileBuffer);
              console.log(fileInfoRef);
            }
          });
        }
      }
    }
  });
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
        return {
          keyword: "信息",
          text: txt.slice(11),
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
    { key: "文件名", value: file.name },
    { key: "文件大小", value: prettyBytes(file.size) },
    ...nai.map((v, k) => {
      if (v.keyword == "Comment") {
        comment = JSON.parse(v.text);
        v.keyword = "uc";
        v.text = comment.uc;
        delete comment.uc;
      }
      return {
        key: v.keyword,
        value: v.text,
      };
    }),
  ];
  fileInfoRef.push({ comment });

  if (nai.length == 0) {
    fileInfoRef.push({
      key: "提示",
      value: "这可能不是一张NovelAI生成的图或者不是原图, 经过了压缩",
    });
  }
  return fileInfoRef;
}

function handleWebUiTag(data) {
  let promptSplit = data.text.split("Negative prompt: ");
  let otherSplit = promptSplit[1].split("Steps: ");
  return [
    {
      keyword: "提示词",
      text: promptSplit[0],
    },
    {
      keyword: "负面提示词",
      text: otherSplit[0],
    },
    {
      keyword: "其他参数",
      text: "Steps: " + otherSplit[1],
    },
  ];
}

function readExif(fileBuffer) {
  let exifRef = {};
  const data = ExifReader.load(fileBuffer);
  const entries = Object.entries(data);
  exifRef.value = entries.map(([key, value]) => ({ key, value }));
  return exifRef;
}

module.exports = { checkImageDirs, getImagesData };
