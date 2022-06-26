import { useNavigation as useNavigationNative } from "@react-navigation/native";
import { StackNavProp } from "../Navigation/AppStack";

export const useNavigation = () => useNavigationNative<StackNavProp>();
