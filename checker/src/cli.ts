import { main } from "./main";

main(process.cwd(), process.argv).then((code) => process.exit(code[0]));
