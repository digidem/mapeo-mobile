import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackList, HomeTabsList } from "../Navigation/AppStack";

export const useNavigationFromRoot = () =>
  useNavigation<NativeStackNavigationProp<AppStackList>>();

export function useNavigationFromHomeTabs() {
  return useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<HomeTabsList>,
      NativeStackNavigationProp<AppStackList>
    >
  >();
}
