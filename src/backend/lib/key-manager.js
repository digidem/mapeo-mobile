// @ts-check
const deriveKey = require("derive-key");
const sodium = require("sodium-native");
const hypercoreCrypto = require("hypercore-crypto");

const PWHASH_OPSLIMIT = sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;
const PWHASH_MEMLIMIT = sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE;
const PWHASH_ALG = sodium.crypto_pwhash_ALG_DEFAULT;
const NAMESPACE = "mapeo";

class KeyManager {
  #masterKey;
  #identityKeyPair;

  /**
   * @param {string} identityKey A hex-encoded key of at least 16 bytes used to
   * derive a 32-byte master key, which is used to derive the device key pair
   * and key pairs for each hypercore
   */
  constructor(identityKey) {
    if (typeof identityKey !== "string" || identityKey.length < 32) {
      throw new Error("identityKey must be a hex string of at least 16 bytes");
    }
    this.#masterKey = Buffer.alloc(32);
    const salt = Buffer.from(identityKey, "hex");
    if (salt.length < 16) {
      throw new Error("identityKey must be a hex string of at least 16 bytes");
    }
    // Derive a 32-byte master key from the 16-byte identity key. We compromise
    // entropy (16 bytes vs 32) for the sake of an identity key that can be
    // easily written down (as 30 base-32 characters or 44 numerical digits). A
    // 32-byte key would be too long and more prone to error when transcribing.
    // We could just hash the identity key, in the same way that derive-key
    // hashes values, but by using pwhash we increase security since it's more
    // work to brute force how the 16-bytes of entropy of the identity key map
    // to the 32-bytes of entropy of the master key.
    sodium.crypto_pwhash(
      this.#masterKey,
      // Zero-length password: all our entropy is in the salt
      Buffer.alloc(0),
      // The salt is the 16-byte identity key
      salt,
      PWHASH_OPSLIMIT,
      PWHASH_MEMLIMIT,
      PWHASH_ALG
    );

    this.#identityKeyPair = generateKeyPair(this.#masterKey, "identity");
  }

  /**
   * Get the public / private key pair for this device / identity.
   */
  get identityKeyPair() {
    return this.#identityKeyPair;
  }

  /**
   * Derive a 32-byte seed for a given project key that is unique to this
   * identity key. CoreStore uses this seed to derive namespaced key pairs
   * for the writeable hypercores in the project.
   *
   * @param {string} projectKey Hex-encoded 32-byte project secret key.
   */
  deriveProjectSeed(projectKey) {
    return deriveKey(NAMESPACE, this.#masterKey, projectKey);
  }
}

module.exports = KeyManager;

/**
 * @param {Buffer} masterKey
 * @param {string} name
 */
function generateKeyPair(masterKey, name) {
  const seed = deriveKey(NAMESPACE, masterKey, name);
  return hypercoreCrypto.keyPair(seed);
}
