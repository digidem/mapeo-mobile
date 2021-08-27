// @flow

//In the api.tsx file, I copy and pasted this typing (directly under the imports) in typescript.
//I didn't want to break the flow typing, but when this gets converted to ts, we also need to edit
//the api.tsx file to just import this instead of hardcoding it in the file.
/*::
type ConstantsType = {|
  IDLE: "IDLE",
  STARTING: "STARTING",
  LISTENING: "LISTENING",
  CLOSING: "CLOSING",
  CLOSED: "CLOSED",
  ERROR: "ERROR",
  TIMEOUT: "TIMEOUT"
|}
*/

const Constants /*: ConstantsType */ = {
  IDLE: "IDLE",
  STARTING: "STARTING",
  LISTENING: "LISTENING",
  CLOSING: "CLOSING",
  CLOSED: "CLOSED",
  ERROR: "ERROR",
  TIMEOUT: "TIMEOUT",
};

module.exports = Constants;
