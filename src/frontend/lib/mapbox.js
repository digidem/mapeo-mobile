"use strict";
// from https://github.com/mapbox/mapbox-gl-js/blob/495a695cb63ed55b4b464da83bfd085738ee57ef/src/util/mapbox.js

const config = {
  API_URL: "https://api.mapbox.com",
  REQUIRE_ACCESS_TOKEN: true,
  ACCESS_TOKEN: null,
};

const help = "See https://www.mapbox.com/api-documentation/#access-tokens";

function makeAPIURL(urlObject, accessToken) {
  const apiUrlObject = parseUrl(config.API_URL);
  urlObject.protocol = apiUrlObject.protocol;
  urlObject.authority = apiUrlObject.authority;

  if (!config.REQUIRE_ACCESS_TOKEN) return formatUrl(urlObject);

  accessToken = accessToken || config.ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      `An API access token is required to use Mapbox GL. ${help}`
    );
  }
  if (accessToken[0] === "s") {
    throw new Error(
      `Use a public access token (pk.*) with Mapbox GL, not a secret access token (sk.*). ${help}`
    );
  }

  urlObject.params.push(`access_token=${accessToken}`);
  return formatUrl(urlObject);
}

export function isMapboxURL(url) {
  return url.indexOf("mapbox:") === 0;
}

export function normalizeStyleURL(url, accessToken) {
  if (!isMapboxURL(url)) return url;
  const urlObject = parseUrl(url);
  urlObject.path = `/styles/v1${urlObject.path}`;
  return makeAPIURL(urlObject, accessToken);
}

export function normalizeGlyphsURL(url, accessToken) {
  if (!isMapboxURL(url)) return url;
  const urlObject = parseUrl(url);
  urlObject.path = `/fonts/v1${urlObject.path}`;
  return makeAPIURL(urlObject, accessToken);
}

export function normalizeSourceURL(url, accessToken) {
  if (!isMapboxURL(url)) return url;
  const urlObject = parseUrl(url);
  urlObject.path = `/v4/${urlObject.authority}.json`;
  // TileJSON requests need a secure flag appended to their URLs so
  // that the server knows to send SSL-ified resource references.
  urlObject.params.push("secure");
  return makeAPIURL(urlObject, accessToken);
}

export function normalizeSpriteURL(url, format, extension, accessToken) {
  const urlObject = parseUrl(url);
  if (!isMapboxURL(url)) {
    urlObject.path += `${format}${extension}`;
    return formatUrl(urlObject);
  }
  urlObject.path = `/styles/v1${urlObject.path}/sprite${format}${extension}`;
  return makeAPIURL(urlObject, accessToken);
}

const imageExtensionRe = /(\.(png|jpg)\d*)(?=$)/;

export function normalizeTileURL(tileURL, sourceURL, tileSize, opts) {
  opts = opts || {};
  if (!sourceURL || !isMapboxURL(sourceURL)) return tileURL;

  const urlObject = parseUrl(tileURL);

  // The v4 mapbox tile API supports 512x512 image tiles only when @2x
  // is appended to the tile URL. If `tileSize: 512` is specified for
  // a Mapbox raster source force the @2x suffix even if a non hidpi device.
  const suffix = opts.devicePixelRatio >= 2 || tileSize === 512 ? "@2x" : "";
  const extension = opts.supportsWebp ? ".webp" : "$1";
  urlObject.path = urlObject.path.replace(
    imageExtensionRe,
    `${suffix}${extension}`
  );

  replaceTempAccessToken(urlObject.params);
  return formatUrl(urlObject);
}

function replaceTempAccessToken(params) {
  for (let i = 0; i < params.length; i++) {
    if (params[i].indexOf("access_token=tk.") === 0) {
      params[i] = `access_token=${config.ACCESS_TOKEN || ""}`;
    }
  }
}

const urlRe = /^(\w+):\/\/([^/?]*)(\/[^?]+)?\??(.+)?/;

function parseUrl(url) {
  const parts = url.match(urlRe);
  if (!parts) {
    throw new Error("Unable to parse URL object");
  }
  return {
    protocol: parts[1],
    authority: parts[2],
    path: parts[3] || "/",
    params: parts[4] ? parts[4].split("&") : [],
  };
}

function formatUrl(obj) {
  const params = obj.params.length ? `?${obj.params.join("&")}` : "";
  return `${obj.protocol}://${obj.authority}${obj.path}${params}`;
}
