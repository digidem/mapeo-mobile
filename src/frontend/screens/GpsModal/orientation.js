// @flow

type SensorValue = {
  x: number,
  y: number,
  z: number
};

export function getInclination(
  accelerationIncludingGravity: SensorValue
): number {
  const { x, y, z } = accelerationIncludingGravity;
  const angle =
    90 -
    (Math.acos(
      z / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2))
    ) *
      180) /
      Math.PI;
  return angle;
}

export function getHeading(
  magnetometerData: SensorValue,
  accelerationIncludingGravity: SensorValue
): number {
  const m = vectorOnPlane(magnetometerData, accelerationIncludingGravity);
  const y = vectorOnPlane({ x: 0, y: 1, z: 0 }, accelerationIncludingGravity);

  const scprdct = m.x * y.x + m.y * y.y + m.z * y.z;
  const mod1 = Math.sqrt(
    Math.pow(m.x, 2) + Math.pow(m.y, 2) + Math.pow(m.z, 2)
  );
  const mod2 = Math.sqrt(
    Math.pow(y.x, 2) + Math.pow(y.y, 2) + Math.pow(y.z, 2)
  );
  let angle = (Math.acos(scprdct / (mod1 * mod2)) * 180) / Math.PI;

  if (m.x > 0) {
    angle = 360 - angle;
  }
  return angle;
}

function vectorOnPlane(obj: SensorValue, a: SensorValue) {
  const n = a;
  const v = obj;

  const mod = Math.sqrt(Math.pow(n.x, 2) + Math.pow(n.y, 2) + Math.pow(n.z, 2));
  const scprdct = (n.x * v.x + n.y * v.y + n.z * v.z) / mod;

  const x = v.x - scprdct * (n.x / mod);
  const y = v.y - scprdct * (n.y / mod);
  const z = v.z - scprdct * (n.z / mod);

  return { x, y, z };
}
