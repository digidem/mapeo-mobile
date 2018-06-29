const utm = require('utm');
const formatcoords = require('formatcoords');

export default function getGPSText({ gpsFormat, lat, lon }) {
  switch (gpsFormat) {
    case 'DDM':
      return formatcoords(lat, lon).format('Ff');
    case 'DMS':
      return formatcoords(lat, lon).format();
    case 'UTM':
      const gpsUTM = utm.fromLatLon(lat, lon);
      const { easting, northing, zoneNum, zoneLetter } = gpsUTM;

      return `${zoneNum}${zoneLetter} ${easting.toFixed(
        2
      )}m E ${northing.toFixed(2)}m N`;
    default:
      return `${lat}, ${lon}`;
  }
}
