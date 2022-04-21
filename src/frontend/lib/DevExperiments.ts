export const devExperiments = () => {
  return {
    onboarding: process.env.FEATURE_ONBOARDING === "true",
    appPasscode: process.env.FEATURE_PASSCODE === "true",
    mapSettings: process.env.FEATURE_MAP_SETTINGS === "true",
  };
};
