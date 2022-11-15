import * as React from "react";

import { MapServerImport, MapServerStyleInfo } from "../sharedTypes";

type MapImportsState = Record<MapServerStyleInfo["id"], MapServerImport["id"]>;

type AddAction = {
  type: "add";
  styleId: string;
  importId: string;
};
type RemoveAction = { type: "remove"; styleId: string };

type MapImportsAction = AddAction | RemoveAction;

function reducer(
  state: MapImportsState,
  action: MapImportsAction
): Readonly<MapImportsState> {
  switch (action.type) {
    case "add": {
      return {
        ...state,
        [action.styleId]: action.importId,
      };
    }
    case "remove": {
      const { [action.styleId]: omitted, ...newState } = state;
      return newState;
    }
  }
}

const StateContext = React.createContext<MapImportsState>({});

const ActionsContext = React.createContext<React.Dispatch<MapImportsAction>>(
  (_action: MapImportsAction) => {}
);

const MapImportsProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = React.useReducer(reducer, {});

  return (
    <StateContext.Provider value={state}>
      <ActionsContext.Provider value={dispatch}>
        {children}
      </ActionsContext.Provider>
    </StateContext.Provider>
  );
};

export {
  StateContext as MapImportsStateContext,
  ActionsContext as MapImportsActionsContext,
  MapImportsProvider,
};
