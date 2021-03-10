let Case = require("case");
let glob = require("glob");
let path = require("path");
let fs = require("fs");
const getRoot = require("./getRoot");

module.exports = (argv) => {
  let rawNpmRoot = getRoot("package.json");
  const npmRoot = rawNpmRoot.foundRoot ? rawNpmRoot.url : "./";
  let rawassetpath = "src/assets/";
  let assetpath = path.join(npmRoot, rawassetpath);
  let files = glob.sync(path.join(assetpath, "/**/*.?(png|jpg|jpeg|svg|webp)"));
  let ImportObject = {};
  files.map((file) => {
    file = path.join(file, "");
    file = file.replace(assetpath, "");
    file = file.replace(/\\/g, "/");
    let baseName = path.basename(file.substr(0, file.lastIndexOf(".")));
    baseName = Case.pascal(baseName);
    if (ImportObject[baseName]) {

      let dirname, newBaseName, folderName

      dirname = file;
      newBaseName = baseName;
      do {
        dirname = path.dirname(dirname);
        folderName = Case.snake(path.basename(dirname));
        newBaseName = (folderName ? folderName + "_" : "") + newBaseName
        let ext = path.extname(file)
        if (ImportObject[newBaseName] && path.extname(ImportObject[newBaseName]) !== ext) {
          newBaseName = newBaseName + "_" + ext.replace(".", "")
        }
      }
      while (ImportObject[newBaseName])
      ImportObject[newBaseName] = file;
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
  fs.writeFile(
    path.join(assetpath, "/index.js"),
    importStatement + "\n" + exportStatement,
    (err) => {
      if (err) console.log("err", err);
    }
  );
};
