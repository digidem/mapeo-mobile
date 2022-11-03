import * as React from "react";

import { MapServerStyleInfo } from "../sharedTypes";

type MapImportsState = Record<
  MapServerStyleInfo["id"],
  // TODO: Should be MapServerImport["id"] but need to fix return type in @mapeo/map-server
  string
>;

type AddAction = {
  type: "add";
  payload: { styleId: string; importId: string }[];
};

type RemoveAction = { type: "remove"; payload: string[] };

type MapImportsAction = AddAction | RemoveAction;

function reducer(state: MapImportsState, action: MapImportsAction) {
  const { type, payload } = action;

  switch (type) {
    case "add": {
      if (payload.every(({ styleId }) => state[styleId])) {
        return state;
      }

      const updatedState = { ...state };

      for (const { styleId, importId } of payload) {
        updatedState[styleId] = importId;
      }

      return updatedState;
    }
    case "remove": {
      if (payload.every(styleId => !state[styleId])) {
        return state;
      }

      const updatedState = { ...state };

      // delete updatedState[styleId];
      for (const styleId of payload) {
        delete updatedState[styleId];
      }

      return updatedState;
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
