import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View, Text } from "react-native";
import { PasswordInput } from "../../../sharedComponents/PasswordInput";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode.NewPasscode.SetPasscode.title",
    defaultMessage: "Set Passcode",
  },
  subTitle: {
    id: "screens.AppPasscode.NewPasscode.SetPasscode.subTitle",
    defaultMessage: "This passcode will be used to open the Mapeo App",
  },
});

interface SetPasscodeProps {
  setInitialPass: (inputtedPass: string) => void;
}

export const SetPasscode = ({ setInitialPass }: SetPasscodeProps) => {
  const [error, setError] = React.useState(false);

  function onError() {
    setError(true);
  }

  function onValidPassword(inputtedValue: string) {
    setInitialPass(inputtedValue);
  }

  return (
    <View>
      <Text>
        <FormattedMessage {...m.title} />
      </Text>

      <Text>
        <FormattedMessage {...m.subTitle} />
      </Text>

      <PasswordInput
        handleError={onError}
        handleCorrectOrNewPass={onValidPassword}
        clearError={() => {
          setError(false);
        }}
      />

      {error && (
        <Text>
          <FormattedMessage />
        </Text>
      )}
    </View>
  );
};
