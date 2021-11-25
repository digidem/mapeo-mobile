declare module "hypercore-crypto" {
  export function discoveryKey(key: Buffer): Buffer;
  export function keyPair(
    seed?: Buffer
  ): { publicKey: Buffer; secretKey: Buffer };
}
