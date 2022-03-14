import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";

export default {
  start: jest.fn(),
  channel: Object.assign(new EventEmitter(), {
    post: jest.fn(),
  }),
};
