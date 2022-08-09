import * as React from "react";
import { MessageDescriptor, useIntl } from "react-intl";
import { useNavigationFromRoot } from "./useNavigationWithTypes";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import CustomHeaderLeft from "../sharedComponents/CustomHeaderLeft";

interface useSetHeaderProps {
  headerTitle?:
    | string
    | MessageDescriptor
    | ((props: {
        children: string;
        tintColor?: string | undefined;
      }) => React.ReactNode);
  backgroundColor?: string;
  headerTintColor?: string;
  headerShown?: boolean;
  headerRight?: NativeStackNavigationOptions["headerRight"];
  headerLeft?: NativeStackNavigationOptions["headerLeft"];
}

export const useSetHeader = (
  titleOrOptions: useSetHeaderProps | MessageDescriptor
) => {
  const { formatMessage: t } = useIntl();
  const navigation = useNavigationFromRoot();

  if (isMessageDescriptor(titleOrOptions)) {
    return React.useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: t(titleOrOptions),
      });
    }, [navigation, t, titleOrOptions]);
  }

  const {
    headerTitle,
    headerRight,
    backgroundColor,
    headerTintColor,
    headerShown,
    headerLeft,
  } = titleOrOptions;

  return React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: isMessageDescriptor(headerTitle)
        ? t(headerTitle)
        : headerTitle,
      headerRight: headerRight,
      headerStyle: {
        backgroundColor: backgroundColor,
      },
      // For some reason, when headerTintColor is set, the back button is not getting the tint color. So I am setting it directly in custom header left.
      headerLeft: !!headerLeft
        ? headerLeft
        : props => (
            <CustomHeaderLeft
              headerBackButtonProps={props}
              tintColor={headerTintColor}
            />
          ),
      headerTintColor: headerTintColor,
      headerShown,
    });
  }, [navigation, t, titleOrOptions]);
};

function isMessageDescriptor(value: unknown): value is MessageDescriptor {
  return typeof value === "object" && !!value && "defaultMessage" in value;
}
