import React from "react";

//This needs to be opened on each initial screen (aka, when we have an
//onboarding stack, this needs to be put on the initial screen of the onboarding
//stack as well).
import { Linking, Platform } from "react-native";
import { useNavigation } from "react-navigation-hooks";

export function useDeepLink() {
  const { navigate } = useNavigation();

  React.useEffect(() => {
    deepLinkSetUp();

    return () => deepLinkTakeDown();
  });

  function handleUrl({ url }: { url: string | null }) {
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

  function deepLinkSetUp() {
    console.log("This is being activated");
    if (Platform.OS === "android") {
      Linking.addEventListener("url", handleUrl);

      Linking.getInitialURL().then(url => {
        handleUrl({ url });
      });
    }
  }

  function deepLinkTakeDown() {
    Linking.removeEventListener("url", handleUrl);
  }
}
