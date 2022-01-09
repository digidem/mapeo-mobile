const { KeyManager, invites } = require("@mapeo/crypto");

/**
 * @typedef {{identityPublicKey: Buffer, host?: { host: string, port: number }, name?: string}} JoinRequest
 */

export class CryptoManager {
  km;
  /**@type {Buffer} */
  deviceId;
  /**@type {{publicKey: Buffer, secretKey: Buffer }} */
  keyPair;
  /**@type {JoinRequest} */
  joinRequest;

  constructor() {
    this._init();
  }

  _init() {
    this.deviceId = KeyManager.generateIdentityKey();
    this.km = new KeyManager(this.deviceId);
    this.keyPair = this.km.getIdentityKeypair();
    this.joinRequest.identityPublicKey = this.keyPair.publicKey;
  }

  /**
   *
   * @returns {string}
   */
  createReqToJoinProject() {
    return invites.encodeJoinRequest(this.joinRequest, { encoding: "base62" });
  }

  /**
   *
   * @param {string} joinReqAsString
   * @param {string} projectKey
   * @returns {string}
   */
  createInvite(joinReqAsString, projectKey) {
    /** @type {JoinRequest} */
    const joinRequest = invites.decodeJoinRequest(joinReqAsString, {
      encoding: "base62",
    });

    const projKeyAsBuffer = Buffer.from(projectKey, "utf-8");
    return invites.generateInvite(joinRequest, {
      encoding: "base62",
      projectKey: projKeyAsBuffer,
    });
  }

  /**
   *
   * @param {string} invite
   * @returns {string}
   */
  acceptProjectInvite(invite) {
    /**@type {Buffer} */
    const projKey = invites.decodeInviteSecretMessage(
      invite,
      this.keyPair.publicKey,
      this.keyPair.secretKey,
      { encoding: "base62" }
    );
    return projKey.toString();
  }
}
