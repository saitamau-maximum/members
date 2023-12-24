import { bgRed, bgYellow, bgCyan, bgGreen, bgBlue } from "picocolors";

export const warn = (...args: any[]) =>
  console.warn(bgYellow(" WARN "), ...args);

export const error = (...args: any[]) =>
  console.error(bgRed(" ERROR "), ...args);

export const info = (...args: any[]) => console.info(bgBlue(" INFO "), ...args);

let isVerbose = false;
export const setVerbose = (verbose: boolean) => (isVerbose = verbose);

export const debug = (...args: any[]) => {
  if (isVerbose) console.log(bgCyan(" DEBUG "), ...args);
};

export const success = (...args: any[]) =>
  console.log(bgGreen(" SUCCESS "), ...args);

export const newline = () => console.log();
