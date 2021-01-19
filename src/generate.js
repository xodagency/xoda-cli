// const template = require("./template");
const inquirer = require('inquirer');
const program = require('commander');
const Case = require('case');
const path = require('path');
const package = require('../package.json');
const template = require('./template');
const getRoot = require('./getRoot');
let fs = require('fs');
const gatherComponent = require('./gather-component');
const configFilename = 'xoda-cli-config.json';

let rawNpmRoot = getRoot(configFilename);
const npmRoot = rawNpmRoot.foundRoot ? rawNpmRoot.url : './';
const configPath = path.join(npmRoot, configFilename);
const writeConfig = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      message: 'Choose File Extension?',
      name: 'jsext',
      choices: ['JSX', 'JS', 'TSX', 'TS'],
    },
    {
      type: 'list',
      message: 'css or scss?',
      name: 'styleext',
      choices: ['scss', 'css'],
    },
    {
      type: 'confirm',
      message: 'Also generate lazy formats?',
      name: 'generateLazy',
    },
    {
      type: 'confirm',
      message: 'Also generate Storybook?',
      name: 'generateStorybook',
    },
    {
      type: 'confirm',
      message: 'Also generate test?',
      name: 'generateTest',
    },
  ]);

  console.log(answers);
  answers.jsext = Case.lower(answers.jsext);
  fs.writeFileSync(configPath, JSON.stringify(answers, null, 4), (err) => {
    if (err) console.log('err', err);
  });
  console.log('finish configure! you can re-run the command');
};
let generate = (basedir, config) => (type, atomic_type, name) => {
  atomtypes = {
    atom: 'atoms/',
    molecule: 'molecules/',
    organism: 'organisms/',
    template: 'templates/',
  };
  compages = {
    c: 'Components',
    p: 'Pages',
  };
  name = {
    normal: name,
    pascal: Case.pascal(name),
    camel: Case.camel(name),
    lower: Case.lower(name),
  };
  cate = type == 'c' ? atomtypes[atomic_type] || '' : '';
  compage = {
    normal: compages[type],
    pascal: Case.pascal(compages[type]),
    camel: Case.camel(compages[type]),
    lower: Case.lower(compages[type]),
  };
  let erro = "";
  Object.keys(template).map((key) => {
    if (key == 'lazy' && !config.generateLazy) return;
    if (key == 'story' && !config.generateStorybook) return;
    if (key == 'test' && !config.generateTest) return;
    const { jsext, styleext } = config;
    const { js, ts, jsx, tsx } = {
      js: jsext.toLowerCase().startsWith("js"),
      ts: jsext.toLowerCase().startsWith("ts"),
      jsx: jsext.toLowerCase().startsWith("jsx"),
      tsx: jsext.toLowerCase().startsWith("tsx")
    }
    filename = template[key].path({ basedir, compage, cate, name, jsext, styleext, is: { js, ts, jsx, tsx } });
    fcontent = template[key].content({
      compage,
      cate,
      name,
      jsext,
      styleext,
      is: { js, ts, jsx, tsx },
    });
    if (fs.existsSync(filename)) {
      console.log(filename, 'is already created');
      erro = "some file already exists"
      return;
    }
    console.log(filename);
    fs.mkdirSync(path.dirname(filename), { recursive: true }, (err) => {

      if (err) {
        erro = "having trouble to make directory"
        throw err;
      }
    });
    fs.writeFileSync(filename, fcontent, (err) => {
      if (err) {
        console.log('err', err);
        erro = "some file have error"
      }
    });
  });
  if (erro) return console.log(erro)
  console.log("Gathering component...")
  gatherComponent.gatherComponent(basedir)()
};
module.exports = async (argv) => {

  if (
    !(argv.includes('--help') || argv.includes('-h') || argv.includes('help'))
  ) {
    if (!rawNpmRoot.foundRoot)
      if (
        !(
          await inquirer.prompt([
            {
              type: 'confirm',
              message: `Did not found ${configFilename} nor package.json do you want to generate ${configFilename} here?`,
              name: 'generatehere',
            },
          ])
        ).generatehere
      )
        return;

    if (!fs.existsSync(configPath)) {
      if (
        !(
          await inquirer.prompt([
            {
              type: 'confirm',
              message: `this will generate ${configFilename} config file in this project root(${path.basename(
                npmRoot
              )}/${configFilename})?`,
              name: 'generatehere',
            },
          ])
        ).generatehere
      )
        return;
      await writeConfig();
      return;
    }
    const configBuffer = fs.readFileSync(configPath);
    const config = JSON.parse(configBuffer);
    generate = generate("src", config)

  }

  program
    .version(package.version) //
    .description(package.description);
  program
    .command('component <atomic_type> <name>')
    .alias('c')
    .description('Generate Component')
    .action((type, name) => {
      generate('c', type, name);
    });
  program
    .command('component <name>')
    .alias('ca')
    .description('Generate Atom Component')
    .action((name) => {
      generate('c', 'atom', name);
    });
  program
    .command('component <name>')
    .alias('cm')
    .description('Generate Molecule Component')
    .action((name) => {
      generate('c', 'molecule', name);
    });
  program
    .command('component <name>')
    .alias('co')
    .description('Generate Organism Component')
    .action((name) => {
      generate('c', 'organism', name);
    });
  program
    .command('component <name>')
    .alias('ct')
    .description('Generate Template Component')
    .action((name) => {
      generate('c', 'template', name);
    });
  program
    .command('page <name>')
    .alias('p')
    .description('Generate Page')
    .action((name) => {
      generate('p', '', name);
    });
  program.parse(argv);
};
module.exports.generate = generate 