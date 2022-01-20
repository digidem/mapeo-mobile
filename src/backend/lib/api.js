// @ts-check
const { TypedEmitter } = require("tiny-typed-emitter");
const debug = require("debug");
const throttle = require("lodash/throttle");
const { AbortController } = require("abort-controller");
const crypto = require("crypto");
const { hasLegacyKey } = require("./project");

const log = debug("mapeo-core:api");

module.exports = createApi;

/** @typedef {import('./types').Api} Api */
/** @typedef {import('./types').Peer} Peer */
/** @typedef  {TypedEmitter<import('./types').SyncApiEvents>} SyncEmitter */
/** @typedef {TypedEmitter<import('../upgrade-manager/types').ManagerEvents>} UpgradeEmitter */

const upgradeManagerFailError = new Error("Upgrade manager failed to load");
const upgradeManagerStub = {
  async start() {
    throw upgradeManagerFailError;
  },
  async stop() {
    throw upgradeManagerFailError;
  },
  getState() {
    return /** @type {import('../upgrade-manager/types').UpgradeState} */ ({
      value: "error",
      error: upgradeManagerFailError,
      uploads: [],
      downloads: [],
      checkedPeers: [],
    });
  },
};

/**
 * @param {object} options
 * @param {import('../upgrade-manager/index')} [options.upgradeManager]
 * @param {any} options.mapeoCore Instance of Mapeo Core
 * @param {import('./project')} options.project Instance of the project interface
 * @param {import('./config')} options.config Instance of the config interface
 * @returns {Api}
 */
function createApi({ mapeoCore, upgradeManager, project, config }) {
  // The sync code is a tangle of event emitters and listeners. Calling abort
  // will remove all the listeners
  let abortController = new AbortController();

  /** @type {SyncEmitter} */
  const syncEmitter = new TypedEmitter();

  /** @type {UpgradeEmitter} */
  const upgradeEmitter = new TypedEmitter();

  // Since we do not yet support multi-project, switching projects requires
  // creating a new instance of mapeoCore, which means that we need to remove
  // and then re-add the event listeners on mapeoCore
  addSyncEventListeners();
  if (upgradeManager) {
    upgradeManager.on("state", state => upgradeEmitter.emit("state", state));
    upgradeManager.on("error", error => upgradeEmitter.emit("error", error));
  }

  function addSyncEventListeners() {
    mapeoCore.sync.on("peer", onNewPeer);
    mapeoCore.sync.on("down", throttledEmitPeers);
    abortController.signal.addEventListener(
      "abort",
      () => {
        mapeoCore.sync.off("peer", onNewPeer);
        mapeoCore.sync.off("down", throttledEmitPeers);
      },
      { once: true }
    );
  }

  const throttledEmitPeers = throttle(() => {
    syncEmitter.emit("peers", getPeers());
  });

  /** @type {Api['sync']['joinSwarm']} */
  function joinSwarm({ deviceName } = {}) {
    const projectKey = project.get().key;
    if (deviceName) mapeoCore.sync.setName(deviceName);
    log("Joining swarm", projectKey && projectKey.slice(0, 4));
    mapeoCore.sync.join(projectKey);
  }

  /** @type {Api['sync']['leaveSwarm']} */
  function leaveSwarm() {
    const projectKey = project.get().key;
    log("Leaving swarm", projectKey && projectKey.slice(0, 4));
    mapeoCore.sync.leave(projectKey);
  }

  /** @type {Api['sync']['startSync']} */
  function startSync(target) {
    if (!target.host || !target.port)
      throw new Error("Target is missing host and port");
    const peerSync = mapeoCore.sync.replicate(target, {
      deviceType: "mobile",
    });
    monitorPeerSyncProgress(peerSync);
  }

  /** @type {Api['sync']['getPeers']} */
  function getPeers() {
    return mapeoCore.sync.peers().map(convertPeer);
  }

  /**
   * Whenever a new peer appears, we emit the `peers` event and attach an event
   * listener for sync being initiated by the remote peer
   *
   * @private
   * @param {any} peer
   */
  function onNewPeer(peer) {
    syncEmitter.emit("peers", getPeers());
    if (!peer.sync) {
      return log("Could not monitor peer, missing sync property");
    }
    peer.sync.once("sync-start", onSyncStart);

    abortController.signal.addEventListener("abort", onabort, { once: true });

    function onabort() {
      peer.sync.off("sync-start", onSyncStart);
    }

    function onSyncStart() {
      abortController.signal.removeEventListener("abort", onabort);
      monitorPeerSyncProgress(peer.sync);
    }
  }

  /**
   * `mapeoCore.sync.replicate` returns a `PeerSync` event emitter that emits
   * progress of a peer's sync. This sends those progress events to the frontend
   *
   * @private
   * @param {any} peerSync */
  function monitorPeerSyncProgress(peerSync) {
    const startTime = Date.now();
    peerSync.on("error", onend);
    peerSync.on("progress", throttledEmitPeers);
    peerSync.on("end", onend);
    syncEmitter.emit("peers", getPeers());

    abortController.signal.addEventListener("abort", onabort, { once: true });

    function onabort() {
      onend(new Error("AbortError"));
    }

    /** @param {Error} [err] */
    function onend(err) {
      if (err) {
        log(err.message);
        syncEmitter.emit("error", err);
      } else {
        const syncDurationSecs = ((Date.now() - startTime) / 1000).toFixed(2);
        log("Sync completed in " + syncDurationSecs + " seconds");
      }
      peerSync.removeListener("error", onend);
      peerSync.removeListener("progress", throttledEmitPeers);
      peerSync.removeListener("end", onend);
      abortController.signal.removeEventListener("abort", onabort);
      syncEmitter.emit("peers", getPeers());
    }
  }

  /** @type {Api['project']['getInfo']} */
  function getInfo() {
    // We don't expose the project key in the API
    const { key, ...info } = project.get();
    return info;
  }

  /** @type {Api['project']['replaceConfig']} */
  async function replaceConfig(fileUri) {
    const practiceMode = project.get().practiceMode;
    const legacyInfo = await config.import(fileUri);
    // If the config contained legacy project info, and the user has not already
    // joined a project (e.g. they are in practice mode), then join the project
    // defined in the config
    if (hasLegacyKey(legacyInfo) && practiceMode) {
      return joinProject(legacyInfo);
    } else {
      // TODO: Also update the project name from the config?
      return getInfo();
    }
  }

  /** @type {Api['project']['join']} */
  async function joinProject(projectInfo) {
    if (projectInfo.key === project.get().key) return project.get();
    abortController.abort();
    abortController = new AbortController();
    mapeoCore = await project.join(projectInfo);
    addSyncEventListeners();
    return getInfo();
  }

  /** @type {Api['project']['create']} */
  async function createProject({ name }) {
    const key = crypto.randomBytes(32).toString("hex");
    return joinProject({ key, name });
  }

  /** @type {Api['project']['leave']} */
  async function leaveProject() {
    abortController.abort();
    abortController = new AbortController();
    mapeoCore = await project.leave();
    addSyncEventListeners();
    return getInfo();
  }

  return {
    sync: Object.assign(syncEmitter, {
      joinSwarm,
      startSync,
      leaveSwarm,
      getPeers,
    }),
    project: {
      getInfo,
      replaceConfig,
      create: createProject,
      join: joinProject,
      leave: leaveProject,
    },
    upgrade: Object.assign(
      upgradeEmitter,
      upgradeManager
        ? {
            start: () => upgradeManager.start(),
            stop: () => upgradeManager.stop(),
            getState: () => upgradeManager.getState(),
          }
        : upgradeManagerStub
    ),
  };
}

/**
 * Convert a `peer` object returned by Mapeo Core so that it can be sent over
 * the bridge. Remove the `connection` property (which is a stream) and
 * stringify the Buffers
 *
 * @param {any} peer
 * @returns {Peer}
 */
function convertPeer(peer) {
  const { connection, ...rest } = peer;
  return {
    ...rest,
    channel: Buffer.isBuffer(rest.channel)
      ? rest.channel.toString("hex")
      : undefined,
    swarmId: Buffer.isBuffer(rest.swarmId)
      ? rest.swarmId.toString("hex")
      : undefined,
  };
}
