//This needs to be opened on each initial screen (aka, when we have an
//onboarding stack, this needs to be put on the initial screen of the onboarding
//stack as well).
import { Linking, Platform } from "react-native";
import { NavigationNavigateAction, NavigationParams } from "react-navigation";
import type {} from "react-navigation-stack";

type nav = (
  routeName:
    | string
    | {
        action?: NavigationNavigateAction;
        key?: string;
        params?: NavigationParams;
        routeName: string;
      },
  params?: NavigationParams,
  action?: NavigationNavigateAction
) => boolean;

export function deepLinkSetUp(navigate: nav) {
  console.log("This is being activated");
  if (Platform.OS === "android") {
    Linking.addEventListener("url", ({ url }) => {
      handleUrl(navigate, url);
    });

    Linking.getInitialURL().then(url => {
      handleUrl(navigate, url);
    });
  }
}

function handleUrl(navigate: nav, url?: string | null) {
  if (!url) return;
  const route = url.replace(/.*?:\/\//g, "");
  const id = route.match(/\/([^\/]+)\/?$/)![1];
  const routeName = route.split("/")[0];
  // if(routeName === "projInvite")
  // {
  //     navigate("InviteModal", {id})
  // }

  //Placeholder
  navigate("CategoryChooser");
}

export function deepLinkTakeDown(navigate: nav) {
  Linking.removeEventListener("url", ({ url }) => {
    handleUrl(navigate, url);
  });
}
