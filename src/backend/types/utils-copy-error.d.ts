// Type definitions for utils-copy-error 1.0.1
// Project: https://github.com/kgryte/utils-copy-error
// TypeScript Version: 4.2

declare module "utils-copy-error" {
  function copyError<T extends Error>(error: T): T;

  export = copyError;
}
