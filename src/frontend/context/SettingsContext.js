// @flow
import * as React from "react";
import AsyncStorage from "@react-native-community/async-storage";

const STORE_KEY = "@MapeoSettings@36";

export type SettingsContextType = {
  coordinateSystem?: string,
};

const initialState = {
  coordinateSystem: "utm",
};

const defaultContext = [initialState, () => {}];
const SettingsContext = React.createContext(defaultContext);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set": {
      return action.value;
    }
    case "set_coordinate_system": {
      try {
        return { ...state, coordinateSystem: action.value };
      } catch {
        return state;
      }
    }
    default:
      return state;
  }
}

const getData = async dispatch => {
  try {
    // AsyncStorage.clear()
    const state = await AsyncStorage.getItem(STORE_KEY);
    if (state) {
      const parsedState = JSON.parse(state);
      dispatch({ type: "set", value: parsedState });
      return parsedState;
    } else return initialState;
  } catch (e) {
    console.log("Failed to fetch the data from storage");
    return initialState;
  }
};

const saveData = async value => {
  try {
    const stringified = JSON.stringify(value);
    await AsyncStorage.setItem(STORE_KEY, stringified);
    return value;
  } catch (e) {
    console.log("Failed to save the data to the storage");
  }
};

export const SettingsProvider = ({ children }: { children: React.Node }) => {
  const didMountRef = React.useRef(false);
  const [state, dispatch] = React.useReducer(reducer, defaultContext[0]);
  const contextValue = React.useMemo(() => [state, dispatch], [
    state,
    dispatch,
  ]);
  React.useEffect(() => {
    if (didMountRef.current) {
      saveData(contextValue[0]);
    } else {
      didMountRef.current = true;
      getData(dispatch);
    }
  }, [contextValue]);
  return (
    <SettingsContext.Provider
      value={{ settings: contextValue[0], dispatch: contextValue[1] }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
