const mockedRNFS = {
  unlink: () => {}
};

Object.defineProperty(mockedRNFS, "ExternalDirectoryPath", {
  get: () => "__ExternalDirectoryPath__"
});

Object.defineProperty(mockedRNFS, "DocumentDirectoryPath", {
  get: () => "__DocumentDirectoryPath__"
});

module.exports = mockedRNFS;
