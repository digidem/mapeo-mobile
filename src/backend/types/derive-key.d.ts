declare module "derive-key" {
  function derive(
    namespace: string,
    masterKey: Buffer,
    input: Buffer | string,
    output?: Buffer
  ): Buffer;
  export = derive;
}
