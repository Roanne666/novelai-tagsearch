const util = require("util");
const config = require("../config.json");

const SITES = [
  {
    needProxy: true,
    include: "pximg",
    referer: "https://www.pixiv.net",
    imageType: "jpg",
  },
  {
    needProxy: false,
    include: "yuque",
    referer: "https://cdn.nlark.com/",
    imageType: "png",
  },
];

const PROXY = getProxy();

function getProxy() {
  let proxy;
  if (config.use_proxy) {
    proxy = util.format(config.proxy_scheme + "://%s:%d", config.proxy_ip, config.proxy_port);
  }
  return proxy;
}

function getOptions(url) {
  let referer, proxy, imageType;
  for (let SITE of SITES) {
    if (url.includes(SITE.include)) {
      referer = SITE.referer;
      imageType = SITE.imageType;
      if (SITE.needProxy) {
        proxy = PROXY;
      }
      break;
    }
  }
  let options = {
    url,
    headers: {
      referer,
    },
    proxy,
  };
  return { options, imageType };
}

module.exports = { getOptions };
