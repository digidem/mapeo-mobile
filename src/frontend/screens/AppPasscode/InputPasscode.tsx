import * as React from "react";
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from "react-intl";
import { View, StyleSheet, Text } from "react-native";
import { useBlurOnFulfill } from "react-native-confirmation-code-field";
import { WHITE, RED } from "../../lib/styles";
import Button from "../../sharedComponents/Button";
import {
  CELL_COUNT,
  PasscodeInput,
} from "../../sharedComponents/PasscodeInput";

const m = defineMessages({
  button: {
    id: "screens.AppPasscode.NewPasscode.InputPasscodeScreen.button",
    defaultMessage: "Next",
  },
});
interface InputPasscodeProps {
  text: {
    title: MessageDescriptor;
    subtitle: MessageDescriptor;
    errorMessage: MessageDescriptor;
  };
  validate: () => void;
  showPasscodeValues?: boolean;
  error: boolean;
  inputValue: string;
  setInputValue: (val: string) => void;
}

export const InputPasscode = ({
  validate,
  text,
  showPasscodeValues,
  error,
  inputValue,
  setInputValue,
}: InputPasscodeProps) => {
  const inputRef = useBlurOnFulfill({
    value: inputValue,
    cellCount: CELL_COUNT,
  });

  if (error) inputRef.current?.focus();

  return (
    <React.Fragment>
      <View style={[styles.container]}>
        <Text style={[styles.header]}>
          <FormattedMessage {...text.title} />
        </Text>
        <Text style={[styles.subtext]}>
          <FormattedMessage {...text.subtitle} />
        </Text>

        <PasscodeInput
          ref={inputRef}
          inputValue={inputValue}
          onChangeTextWithValidation={setInputValue}
          maskValues={!showPasscodeValues}
        />

        {error && (
          <Text style={styles.error}>
            <FormattedMessage {...text.errorMessage} />
          </Text>
        )}
      </View>

      <Button fullWidth onPress={validate}>
        <Text style={styles.buttonText}>
          <FormattedMessage {...m.button} />
        </Text>
      </Button>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: WHITE,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    width: "100%",
    minWidth: 90,
    maxWidth: 280,
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: "center",
  },
  subtext: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
  },
  container: {
    padding: 20,
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  },
  error: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
    color: RED,
  },
});
