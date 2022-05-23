export const devExperiments = {
  onboarding: process.env.FEATURE_ONBOARDING === "true",
  appPasscode: process.env.FEATURE_PASSCODE === "true",
  mapSettings: process.env.FEATURE_MAP_SETTINGS === "true",
} as const;

const checkFeatureFlagOn = (featureObject: { [key: string]: boolean }) => {
  for (const k in featureObject) {
    if (featureObject[k]) {
      return true;
    }
  }
  return false;
};

export const featureFlagOn = checkFeatureFlagOn(devExperiments);
