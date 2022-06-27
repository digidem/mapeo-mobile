import { NavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as React from "react";
import { MessageDescriptor, useIntl } from "react-intl";
import { AppStackList } from "../Navigation/AppStack";
import { useNavigation } from "./useNavigationWithTypes";
import type { StackNavigationOptions } from "@react-navigation/stack";
import { BLACK } from "../lib/styles";
import CustomHeaderLeft from "../sharedComponents/CustomHeaderLeft";

interface useSetHeaderProps {
  headerTitle?: MessageDescriptor | string;
  headerRight?: StackNavigationOptions["headerRight"];
  backgroundColor?: string;
  headerTintColor?: string;
  headerShown?: boolean;
}

export const useSetHeader = (options: useSetHeaderProps) => {
  const { formatMessage: t } = useIntl();
  const {
    headerTitle,
    headerRight,
    backgroundColor,
    headerTintColor,
    headerShown,
  } = options;
  const navigation = useNavigation();

  return React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        typeof headerTitle === "string"
          ? headerTitle
          : typeof headerTitle === "undefined"
          ? undefined
          : t(headerTitle),
      headerRight: headerRight || undefined,
      headerStyle: {
        backgroundColor: backgroundColor || "#fff",
      },
      // For some reason, when headerTintColor is set, the back button is not getting the tint color. So I am setting it directly in custom header left.
      headerLeft: props => (
        <CustomHeaderLeft
          headerBackButtonProps={props}
          tintColor={headerTintColor}
        />
      ),
      headerShown,
    });
  }, [navigation, t, options]);
};
