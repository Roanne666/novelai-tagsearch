const config = require("../config.json");

const SITES = [
  {
    needProxy: true,
    include: "pximg",
    referer: "https://www.pixiv.net",
  },
  {
    needProxy: true,
    include: "twimg",
    referer: "https://www.twitter.com/",
  },
];

const PROXY = getProxy();

function getProxy() {
  let proxy;
  if (config.use_proxy) {
    proxy = `${config.proxy_scheme}://${config.proxy_ip}:${config.proxy_port}`;
  }
  return proxy;
}

function getOptions(url) {
  let referer, proxy;
  for (let SITE of SITES) {
    if (url.includes(SITE.include)) {
      referer = SITE.referer;
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
  return { options, imageType: "jpg" };
}

module.exports = { getOptions };
