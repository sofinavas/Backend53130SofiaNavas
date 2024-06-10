const { Command } = require("commander");
const program = new Command();

program
  .option("-p, --production", "production mode")
  .option("-d, --development", "development mode");
program.parse();

module.exports = { program };
