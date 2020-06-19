let Case = require("case");
let glob = require("glob");
let path = require("path");
let fs = require("fs");
const getRoot = require("./getRoot");

module.exports = (argv) => {
  let rawNpmRoot = getRoot("package.json");
  const npmRoot = rawNpmRoot.foundRoot ? rawNpmRoot.url : "./";
  let rawassetpath = "src/components/";
  let assetpath = path.join(npmRoot, rawassetpath);
  let files = glob.sync(path.join(assetpath, "/**/*.?(js|jsx)"));
  let ImportObject = {};
  let duplcount = 1;
  files.map((file) => {
    file = path.join(file, "");
    file = file.replace(assetpath, "");
    file = file.replace(/\\/g, "/");
    let baseName = path.basename(file.substr(0, file.lastIndexOf(".")));

    if (baseName.indexOf(".") >= 0) return;
    baseName = Case.pascal(baseName);
    if (ImportObject[baseName]) {
      ImportObject[baseName + duplcount] = file;
      duplcount++;
    } else ImportObject[baseName] = file;
  });
  let importStatement = "";
  Object.keys(ImportObject).map((k) => {
    console.log(k, "-", ImportObject[k]);
    importStatement += `import ${k} from "./${ImportObject[k]}";\n`;
  });
  let exportStatement = `export {\n\t${Object.keys(ImportObject).join(
    ",\n\t"
  )}\n};`;
  // console.log(path.join(assetpath, "/index.js"));
  // console.log(importStatement + "\n" + exportStatement);
  fs.writeFile(
    path.join(assetpath, "/index.js"),
    importStatement + "\n" + exportStatement,
    (err) => {
      if (err) console.log("err", err);
    }
  );
};
