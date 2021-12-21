// from https://github.com/mapbox/mapbox-gl-js/blob/495a695cb63ed55b4b464da83bfd085738ee57ef/src/util/mapbox.js

interface UrlObject {
  protocol: string;
  authority: string;
  path: string;
  params: string[];
}

const config = {
  API_URL: "https://api.mapbox.com",
  REQUIRE_ACCESS_TOKEN: true,
  ACCESS_TOKEN: null,
};

const help = "See https://www.mapbox.com/api-documentation/#access-tokens";

function makeAPIURL(
  urlObject: UrlObject,
  accessToken: string | null = null
): string {
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

export function isMapboxURL(url: string) {
  return url.indexOf("mapbox:") === 0;
}

export function normalizeStyleURL(url: string, accessToken: string) {
  if (!isMapboxURL(url)) return url;
  const urlObject = parseUrl(url);
  urlObject.path = `/styles/v1${urlObject.path}`;
  return makeAPIURL(urlObject, accessToken);
}

export function normalizeGlyphsURL(url: string, accessToken: string) {
  if (!isMapboxURL(url)) return url;
  const urlObject = parseUrl(url);
  urlObject.path = `/fonts/v1${urlObject.path}`;
  return makeAPIURL(urlObject, accessToken);
}

export function normalizeSourceURL(url: string, accessToken: string) {
  if (!isMapboxURL(url)) return url;
  const urlObject = parseUrl(url);
  urlObject.path = `/v4/${urlObject.authority}.json`;
  // TileJSON requests need a secure flag appended to their URLs so
  // that the server knows to send SSL-ified resource references.
  urlObject.params.push("secure");
  return makeAPIURL(urlObject, accessToken);
}

export function normalizeSpriteURL(
  url: string,
  format: string,
  extension: string,
  accessToken: string
) {
  const urlObject = parseUrl(url);
  if (!isMapboxURL(url)) {
    urlObject.path += `${format}${extension}`;
    return formatUrl(urlObject);
  }
  urlObject.path = `/styles/v1${urlObject.path}/sprite${format}${extension}`;
  return makeAPIURL(urlObject, accessToken);
}

const imageExtensionRe = /(\.(png|jpg)\d*)(?=$)/;

export function normalizeTileURL(
  tileURL: string,
  sourceURL?: string,
  tileSize?: number,
  opts?: { devicePixelRatio?: number; supportsWebp?: boolean }
) {
  opts = opts || {};
  if (!sourceURL || !isMapboxURL(sourceURL)) return tileURL;

  const urlObject = parseUrl(tileURL);

  // The v4 mapbox tile API supports 512x512 image tiles only when @2x
  // is appended to the tile URL. If `tileSize: 512` is specified for
  // a Mapbox raster source force the @2x suffix even if a non hidpi device.
  const suffix =
    (typeof opts.devicePixelRatio === "number" && opts.devicePixelRatio >= 2) ||
    tileSize === 512
      ? "@2x"
      : "";
  const extension = opts.supportsWebp ? ".webp" : "$1";
  urlObject.path = urlObject.path.replace(
    imageExtensionRe,
    `${suffix}${extension}`
  );

  replaceTempAccessToken(urlObject.params);
  return formatUrl(urlObject);
}

function replaceTempAccessToken(params: string[]) {
  for (let i = 0; i < params.length; i++) {
    if (params[i].indexOf("access_token=tk.") === 0) {
      params[i] = `access_token=${config.ACCESS_TOKEN || ""}`;
    }
  }
}

const urlRe = /^(\w+):\/\/([^/?]*)(\/[^?]+)?\??(.+)?/;

function parseUrl(url: string): UrlObject {
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

function formatUrl(obj: UrlObject) {
  const params = obj.params.length ? `?${obj.params.join("&")}` : "";
  return `${obj.protocol}://${obj.authority}${obj.path}${params}`;
}
