import { dirname } from "path";
import { fileURLToPath } from "url";
export const __dirname = dirname(fileURLToPath(import.meta.url));

import { Command } from "commander";
const program = new Command();

program.option("--mode <mode>", "modo de trabajo", "produccion");
program.parse();

export default program;
