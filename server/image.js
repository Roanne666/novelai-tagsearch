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

function getImagesData() {
  readImageBase64((imageRef) => {
    let exifRef = readExif(fileRef);
    let fileInfoRef = readFileInfo(fileRef);
    console.log(exifRef);
    console.log(fileInfoRef);
  });
}

async function readNovelaiTag(file) {
  const buf = await file.arrayBuffer();
  const chunks = extractChunks(new Uint8Array(buf));
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
  console.log(textChunks);
  return textChunks;
}

async function readFileInfo(fileRef) {
  const file = fileRef.value;
  let nai = await readNovelaiTag(file);
  if (nai.length == 1) {
    nai = await handleWebUiTag(nai[0]);
  }
  let fileInfoRef = {};
  fileInfoRef.value = [
    { key: "文件名", value: file.name },
    { key: "文件大小", value: prettyBytes(file.size) },
    ...nai.map((v, k) => {
      if (v.keyword == "Comment") {
        jsonData.value = JSON.parse(v.text);
      }
      return {
        key: v.keyword,
        value: v.text,
      };
    }),
  ];
  if (nai.length == 0) {
    fileInfoRef.value.push({
      key: "提示",
      value: "这可能不是一张NovelAI生成的图或者不是原图, 经过了压缩",
    });
  }
  return fileInfoRef;
}

async function handleWebUiTag(data) {
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

function readImageBase64(fileRef, callback) {
  let imageRef = {};
  imageRef.value = null;
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const { width, height } = image;
      imageRef.value = {
        width,
        height,
        src: reader.result,
      };
      imageMaxSizeRef.value = width;
    };
    image.src = reader.result;
    callback(imageRef);
  };
  reader.readAsDataURL(fileRef.value);
}

async function readExif(fileRef) {
  let exifRef = {};
  const file = fileRef.value;
  const data = ExifReader.load(file);
  const entries = Object.entries(data);
  exifRef.value = entries.map(([key, value]) => ({ key, value }));
  return exifRef;
}

module.exports = { checkImageDirs, getImagesData };
