import pico from "picocolors";

export const warn = (...args: any[]) =>
  console.warn(pico.bgYellow(" WARN "), ...args);

export const error = (...args: any[]) =>
  console.error(pico.bgRed(" ERROR "), ...args);

export const info = (...args: any[]) => console.info(pico.bgBlue(" INFO "), ...args);

let isVerbose = false;
export const setVerbose = (verbose: boolean) => { isVerbose = verbose; }

export const debug = (...args: any[]) => {
  if (isVerbose) console.log(pico.bgCyan(" DEBUG "), ...args);
};

export const success = (...args: any[]) =>
  console.log(pico.bgGreen(" SUCCESS "), ...args);

export const newline = () => console.log();
