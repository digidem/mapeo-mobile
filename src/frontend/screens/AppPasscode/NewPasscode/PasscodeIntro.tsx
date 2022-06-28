import * as React from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "../../../hooks/useNavigationWithTypes";
import Button from "../../../sharedComponents/Button";
import { SecurityContext } from "../../Security/SecurityContext";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode.NewPasscode.Splash.title",
    defaultMessage: "What is App Passcode?",
  },
  description: {
    id: "screens.AppPasscode.NewPasscode.Splash.description",
    defaultMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum diam pulvinar ultrices luctus. Maecenas etiam accumsan nisl, leo. Leo risus non adipiscing nisi, scelerisque. Quis enim nunc.",
  },
  continue: {
    id: "screens.AppPasscode.NewPasscode.Splash.continue",
    defaultMessage: "Continue",
  },
});

interface SplashProps {
  incrementState: () => void;
}

export const PasscodeIntro = ({ incrementState }: SplashProps) => {
  const { setPassIsSet } = React.useContext(SecurityContext);
  const { formatMessage: t } = useIntl();
  const { navigate } = useNavigation();

  function tempStateSet() {
    setPassIsSet(prev => !prev);
    navigate("Security");
  }

  return (
    <View style={[styles.container]}>
      <View>
        <Text style={[styles.title]}>
          <FormattedMessage {...m.title} />
        </Text>
        <Text style={[styles.description]}>
          <FormattedMessage {...m.description} />
        </Text>
      </View>
      <View>
        {/* To do, increment state of the screen */}
        <Button style={[styles.button]} onPress={() => tempStateSet()}>
          {t(m.continue)}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexBasis: "100%",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 20,
  },
  button: {
    width: "100%",
    minWidth: 90,
    maxWidth: 280,
  },
});
