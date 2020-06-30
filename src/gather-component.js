let Case = require("case");
let glob = require("glob");
let path = require("path");
let fs = require("fs");
const getRoot = require("./getRoot");
const outputfile = "index.js";
module.exports = (argv) => {
  let rawNpmRoot = getRoot("package.json");
  const npmRoot = rawNpmRoot.foundRoot ? rawNpmRoot.url : "./";
  let rawassetpath = "src/components/";
  let assetpath = path.join(npmRoot, rawassetpath);
  let files = glob.sync(path.join(assetpath, "/**/*.?(js|jsx)"));
  let ImportObject = {};
  let duplcount = 1;
  files.map((file) => {
    if (path.basename(file) == path.basename(outputfile)) return;
    file = path.join(file, "");
    file = file.replace(assetpath, "");
    file = file.replace(/\\/g, "/");
    let baseName = path.basename(file.substr(0, file.lastIndexOf(".")));

    if (baseName.indexOf(".") >= 0) return;
    baseName = Case.pascal(baseName);
    if (ImportObject[baseName]) {
      ImportObject[baseName + duplcount] = file.substr(
        0,
        file.lastIndexOf(".")
      );
      duplcount++;
    } else ImportObject[baseName] = file.substr(0, file.lastIndexOf("."));
  });
  let importStatement = "";
  Object.keys(ImportObject).map((k) => {
    console.log(k, "-", ImportObject[k]);
    importStatement += `import ${k} from "./${ImportObject[k]}";\n`;
  });
  let exportStatement = `export {\n\t${Object.keys(ImportObject).join(
    ",\n\t"
  )}\n};`;
  // console.log(path.join(assetpath, "/"+outputfile));
  // console.log(importStatement + "\n" + exportStatement);
  fs.writeFile(
    path.join(assetpath, "/" + outputfile),
    importStatement + "\n" + exportStatement,
    (err) => {
      if (err) console.log("err", err);
    }
  );
};
