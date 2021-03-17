import React from "react";
import AsyncStorage from "@react-native-community/async-storage";

const STORE_KEY = "@MapeoCoordinateSystem@2";
const defaultValue = "utm";

export default () => {
  const [value, setLocalValue] = React.useState(defaultValue);
  const [isLoading, setIsLoading] = React.useState(true);
  const setValue = async value => {
    if (value) {
      setIsLoading(true);
      await AsyncStorage.setItem(STORE_KEY, value);
      setLocalValue(value);
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    const getValue = async () => {
      try {
        setIsLoading(true);

        const value = await AsyncStorage.getItem(STORE_KEY);

        if (value === null) {
          return setValue(defaultValue);
        }

        if (value !== null) {
          setLocalValue(value);
        }
      } catch (e) {
        setValue(defaultValue);
      } finally {
        setIsLoading(false);
      }
    };
    getValue();
  }, []);
  return [value, setValue, isLoading];
};
