const { program } = require("commander");
module.exports = (argv) => {
  program
    .version("0.1.0")
    .command(
      "generate <c|component|p|page> [type] <name>",
      "generate react atomic component",
      {
        executableFile: "generate",
      }
    )
    .command("asset", "colect asset to asset index.js", {
      executableFile: "asset",
    })
    .parse(argv);
};
