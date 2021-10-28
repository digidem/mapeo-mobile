import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { BLACK, LIGHT_GREY, MAGENTA, MEDIUM_GREY } from "../../lib/styles";
import Text from "../../sharedComponents/Text";
import { ViewStyleProp } from "../../sharedTypes";

interface InputFieldProps {
  containerStyle?: ViewStyleProp;
  errorMessage?: React.ReactNode;
  label: React.ReactNode;
  maxLength?: number;
  onBlur?: () => void;
  onChangeText: (value: string) => void;
  placeholder?: string;
  value: string;
}

export const InputField = ({
  containerStyle,
  errorMessage,
  label,
  maxLength = 100,
  onBlur,
  onChangeText,
  placeholder,
  value,
}: InputFieldProps) => {
  const showError = !!errorMessage;
  return (
    <View style={containerStyle}>
      <Text style={styles.inputLabel}>
        {label}
        <Text style={styles.requiredMark}>*</Text>
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          maxLength={maxLength}
          onBlur={onBlur}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="silver"
          style={[styles.input, showError && styles.error]}
          underlineColorAndroid="transparent"
          value={value}
        />
        {showError && (
          <MaterialIcon
            name="error"
            color={MAGENTA}
            size={24}
            style={styles.errorIcon}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <View>
          {showError && (
            <Text style={styles.validationErrorText}>{errorMessage}</Text>
          )}
        </View>
        <Text style={styles.characterLengthText}>
          {value.length}/{maxLength}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    fontWeight: "bold",
    color: BLACK,
    fontSize: 18,
  },
  requiredMark: {
    color: MAGENTA,
  },
  inputContainer: {
    justifyContent: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderColor: LIGHT_GREY,
    padding: 14,
    fontSize: 18,
    borderRadius: 4,
    borderWidth: 2,
  },
  errorIcon: {
    position: "absolute",
    right: 12,
  },
  error: {
    borderColor: MAGENTA,
  },
  validationErrorText: {
    fontStyle: "italic",
    color: MAGENTA,
  },
  characterLengthText: {
    alignSelf: "flex-end",
    color: MEDIUM_GREY,
  },
});
