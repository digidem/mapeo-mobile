export const devExperiments = {
  onboarding: process.env.FEATURE_ONBOARDING === "true",
  mapSettings: process.env.FEATURE_MAP_SETTINGS === "true",
} as const;

export const featureFlagOn = Object.values(devExperiments).some(value => value);
