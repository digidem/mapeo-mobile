// @ts-check

/**
 * @param {string} bundleId
 * @return string
 */
function getDiscoveryKey(bundleId) {
  return `upgrade-${bundleId}`;
}

module.exports = {
  getDiscoveryKey,
};
