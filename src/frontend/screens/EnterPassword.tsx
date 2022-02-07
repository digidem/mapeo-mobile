import { orderBy } from "lodash";
import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { MEDIUM_GREY } from "../lib/styles";

const m = defineMessages({
  enterPass: {
    id: "screens.EnterPassword.enterPass",
    defaultMessage: "Enter your passcode",
  },
});

export const EnterPassword: NavigationStackScreenComponent = () => {
  const inputtedValue = React.useRef<number[]>([]);
  const [showPass, setShowPass] = React.useState(() =>
    inputtedValue.current.toString()
  );

  React.useEffect(() => {
    setShowPass(inputtedValue.current.toString());
  }, [inputtedValue.current]);

  return (
    <View>
      <Image source={require("../images/icon_mapeo_pin.png")} />
      <Text>Mapeo</Text>

      <Text>
        <FormattedMessage {...m.enterPass} />
      </Text>

      <Text>{showPass}</Text>

      <PasswordInput inputtedValue={inputtedValue} order={0} />
      <PasswordInput inputtedValue={inputtedValue} order={1} />
      <PasswordInput inputtedValue={inputtedValue} order={2} />
      <PasswordInput inputtedValue={inputtedValue} order={3} />
      <PasswordInput inputtedValue={inputtedValue} order={4} />
    </View>
  );
};

interface PasswordInputProps {
  inputtedValue: React.MutableRefObject<number[]>;
  order: number;
}

const PasswordInput = ({ inputtedValue, order }: PasswordInputProps) => {
  const [singleNumber, setSingleNumber] = React.useState("");
  const isFocused = React.useRef(false);

  React.useEffect(() => {
    const length = inputtedValue.current.length;
    if (length > order) setSingleNumber("*");
    if (length < order) setSingleNumber("");
    if (length === order) {
      if (isFocused) {
        if (!!inputtedValue.current[order])
          setSingleNumber(inputtedValue.current[order].toString());
      } else {
        setSingleNumber("*");
      }
    }
  }, [inputtedValue.current]);

  function changeVal(e: NativeSyntheticEvent<TextInputChangeEventData>) {
    const newVal = parseInt(e.nativeEvent.text);
    if (newVal > 0 && newVal <= 9) {
      const updatedPassword: number[] = [...inputtedValue.current, newVal];
      inputtedValue.current = updatedPassword;
      setSingleNumber(newVal.toString());
    }
  }

  return (
    <TextInput
      onFocus={() => {
        isFocused.current = true;
      }}
      onBlur={() => {
        isFocused.current = false;
      }}
      style={styles.passInput}
      value={singleNumber}
      onChange={changeVal}
    />
  );
};

const styles = StyleSheet.create({
  passInput: {
    borderRadius: 8,
    padding: 10,
    borderColor: MEDIUM_GREY,
    borderWidth: 2,
    color: "#000000",
  },
});
