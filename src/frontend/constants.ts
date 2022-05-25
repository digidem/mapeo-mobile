export const URI_PREFIX = "mapeo://";
export const ERROR_STORE_KEY = "@MapeoError";
export const NAV_STORE_KEY = "@MapeoNav";
// We are using RN_SRC_EXT to do this because in the future we might want to
// mock some files for e2e testing, as described in
// https://github.com/wix/Detox/blob/master/docs/Guide.Mocking.md
// Currently this is only used at runtime to turn off navigation persistence
export const IS_E2E =
  process.env.RN_SRC_EXT && process.env.RN_SRC_EXT.split(",").includes("e2e");

export const NO_PRACTICE_BAR = [
  "ConfirmLeavePracticeMode",
  "JoinRequestModal",
  "ProjectConfig",
  "ProjectInviteModal",
  "SyncModal",
];

export const EDITING_SCREEN_NAMES = [
  "AddPhoto",
  "Camera",
  "CategoryChooser",
  "ManualGpsScreen",
  "ObservationDetails",
  "ObservationEdit",
];

export const TEMP_HIDE_PRACTICE_MODE_UI = ["CreateProject"];
