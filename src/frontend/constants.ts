import { AppStackList, HomeTabsList } from "./Navigation/AppStack";

export const URI_PREFIX = "mapeo://";
export const ERROR_STORE_KEY = "@MapeoError";
export const NAV_STORE_KEY = "@MapeoNativeNav@1";
export const PASSWORD_KEY = "PASSWORD";
export const OBSCURE_KEY = "OBSCURE";
// We are using RN_SRC_EXT to do this because in the future we might want to
// mock some files for e2e testing, as described in
// https://github.com/wix/Detox/blob/master/docs/Guide.Mocking.md
// Currently this is only used at runtime to turn off navigation persistence
export const IS_E2E =
  process.env.RN_SRC_EXT && process.env.RN_SRC_EXT.split(",").includes("e2e");

type Screens = AppStackList & HomeTabsList;

type ScreenNames = (keyof Screens)[];

export const NO_PRACTICE_BAR: ScreenNames = [
  "ConfirmLeavePracticeModeScreen",
  "JoinRequestModal",
  "ProjectConfig",
  "ProjectInviteModal",
  "SyncModal",
];

export const EDITING_SCREEN_NAMES: ScreenNames = [
  "AddPhoto",
  "Camera",
  "CategoryChooser",
  "ManualGpsScreen",
  "ObservationDetails",
  "ObservationEdit",
];

export const TEMP_HIDE_PRACTICE_MODE_UI: ScreenNames = [
  "CreateProjectScreen",
  "IccaInfo",
  "IccaIntro",
];

// this has to be a string because js does not recognize 00000 as being 5 digits
export const OBSCURE_PASSCODE = "00000";
