import * as React from "react";
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from "react-intl";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useBlurOnFulfill } from "react-native-confirmation-code-field";
import { useNavigationFromRoot } from "../../hooks/useNavigationWithTypes";
import { WHITE, RED, MAPEO_BLUE } from "../../lib/styles";
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
  cancel: {
    id: "screens.AppPasscode.InputPasscodeScreen.cancel",
    defaultMessage: "Cancel",
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

  const { goBack } = useNavigationFromRoot();
  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text style={[styles.header]}>
            <FormattedMessage {...text.title} />
          </Text>
          <Text style={[styles.subtext]}>
            <FormattedMessage {...text.subtitle} />
          </Text>

          <PasscodeInput
            error={error}
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

        <View>
          <Button
            fullWidth
            variant="outlined"
            style={{ marginBottom: 20, marginTop: 20 }}
            onPress={goBack}
          >
            <Text style={[styles.buttonText, { color: MAPEO_BLUE }]}>
              <FormattedMessage {...m.cancel} />
            </Text>
          </Button>

          <Button fullWidth onPress={validate}>
            <Text style={[styles.buttonText, { color: WHITE }]}>
              <FormattedMessage {...m.button} />
            </Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonText: {
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
    height: "100%",
    flex: 1,
    justifyContent: "flex-start",
  },
  error: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
    color: RED,
  },
});
