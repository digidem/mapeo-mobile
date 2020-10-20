/* eslint-env detox/detox, jest/globals */

// Improved Detox API to reduce syntax noise
module.exports = {
  byId: str => element(by.id(str)),
  byLabel: str => element(by.label(str)),
  byText: str => element(by.text(str)),
  byType: str => element(by.type(str))
};
