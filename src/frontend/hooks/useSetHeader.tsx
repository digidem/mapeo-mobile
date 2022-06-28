import * as React from "react";
import { MessageDescriptor, useIntl } from "react-intl";
import { useNavigation } from "./useNavigationWithTypes";
import type { StackNavigationOptions } from "@react-navigation/stack";
import CustomHeaderLeft from "../sharedComponents/CustomHeaderLeft";

interface useSetHeaderProps {
  headerTitle?:
    | MessageDescriptor
    | ((props: {
        children: string;
        tintColor?: string | undefined;
      }) => React.ReactNode)
    | undefined;
  headerRight?: StackNavigationOptions["headerRight"];
  backgroundColor?: string;
  headerTintColor?: string;
  headerShown?: boolean;
  headerLeft?: StackNavigationOptions["headerLeft"];
}

export const useSetHeader = (
  titleOrOptions: useSetHeaderProps | MessageDescriptor
) => {
  const { formatMessage: t } = useIntl();
  const navigation = useNavigation();

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
      headerShown,
    });
  }, [navigation, t, titleOrOptions]);
};

function isMessageDescriptor(value: any): value is MessageDescriptor {
  return "defaultMessage" in value;
}
