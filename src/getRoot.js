let fs = require("fs");
const path = require("path");
const getRoot = (configFilename) => {
  let lastpath = "";
  let foundRoot = false;
  const _getRoot = (url) => {
    if (
      fs.existsSync(path.join(url, configFilename)) ||
      fs.existsSync(path.join(url, "package.json"))
    ) {
      foundRoot = true;
      return url;
    }
    // console.log(url);
    if (url == lastpath) return url;
    lastpath = url;
    return _getRoot(path.dirname(url));
  };
  let url = _getRoot(process.cwd());
  return { url, foundRoot };
};
module.exports = (configFilename) => getRoot(configFilename);
