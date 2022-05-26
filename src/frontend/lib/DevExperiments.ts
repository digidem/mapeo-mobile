export const devExperiments = {
  onboarding: process.env.FEATURE_ONBOARDING === "true",
  appPasscode: process.env.FEATURE_PASSCODE === "true",
  mapSettings: process.env.FEATURE_MAP_SETTINGS === "true",
} as const;

export const featureFlagOn = Object.values(devExperiments).some(value => value);
