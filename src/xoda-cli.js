const { program } = require("commander");
const package = require('../package.json');
module.exports = (argv) => {
  program
    .version(package.version)
    .command(
      "generate <c|component|p|page> [type] <name>",
      "generate react atomic component",
      {
        executableFile: "generate",
      }
    )
    .command("gather-asset", "colect asset to asset's index.js", {
      executableFile: "gather-asset",
    })
    .command("gather-component", "colect component to component's index.js", {
      executableFile: "gather-component",
    })
    .parse(argv);
};
