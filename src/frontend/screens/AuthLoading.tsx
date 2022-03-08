import * as React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "react-navigation-hooks";
import { PASSWORD_KEY, KILL_KEY } from "../constants";
import { SecurityContext } from "../context/SecurityContext";
import Loading from "../sharedComponents/Loading";
import { StyleSheet, View } from "react-native";
import { WHITE } from "../lib/styles";

export const AuthLoading = () => {
  const [, setAuthState] = React.useContext(SecurityContext);
  const { navigate } = useNavigation();

  React.useEffect(() => {
    async function initialize(): Promise<boolean | undefined> {
      const [[, password], [, killModeEnabled]] = await AsyncStorage.multiGet([
        PASSWORD_KEY,
        KILL_KEY,
      ]);

      if (killModeEnabled === "true" && !!password) {
        setAuthState({ type: "killModeEnabled:set", newKillModeValue: true });
      } else {
        setAuthState({ type: "killModeEnabled:set", newKillModeValue: false });
      }

      if (!!password) {
        setAuthState({ type: "setPasscode", newPasscode: password });
        setAuthState({ type: "setAuthStatus", newAuthStatus: "pending" });
        return true;
      }
    }

    initialize().then(hasPassword => {
      if (hasPassword) {
        navigate("AuthStack");
        return;
      }

      navigate("AppStack");
    });
  }, []);

  return (
    <View style={styles.container}>
      <Loading />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    flex: 1,
  },
});
