import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { AppStackList, HomeTabsList } from "../Navigation/AppStack";

export const useNavigationFromRoot = () =>
  useNavigation<NativeStackNavigationProp<AppStackList>>();

export function useNavigationFromHomeTabs<
  ScreenName extends keyof HomeTabsList
>() {
  return useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<HomeTabsList, ScreenName>,
      StackNavigationProp<AppStackList>
    >
  >();
}
