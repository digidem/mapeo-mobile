// needed until https://github.com/mbostock/d3/pull/2591 lands

  if (typeof define === "function" && define.amd) define(this.d3 = d3);
  else if (typeof module === "object" && module.exports) module.exports = d3;
  else this.d3 = d3;
}();
