import { main } from "./main.js";

main(process.cwd(), process.argv).then((code) => process.exit(code[0]));
