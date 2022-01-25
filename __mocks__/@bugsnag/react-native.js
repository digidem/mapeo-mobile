export default {
  start: jest.fn(),
  leaveBreadcrumb: jest.fn((...args) =>
    console.log.apply(console, ["leaveBreadcrumb", ...args])
  ),
  notify: jest.fn((...args) => console.log.apply(console, ["notify", ...args])),
};
