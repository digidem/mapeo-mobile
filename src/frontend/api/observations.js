import fixture from "./test_observations.json";

export default class ObservationsApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  list(cb) {
    setTimeout(() => cb(null, fixture), 2000);
  }
  update() {}
  create() {}
}
