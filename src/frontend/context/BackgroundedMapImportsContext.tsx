import * as React from "react";

type BackgroundedMapImportsState = Record<string, string>;

type AddAction = {
  type: "add";
  payload: { styleId: string; importId: string };
};

type RemoveAction = { type: "remove"; payload: { styleId: string } };

type BackgroundedMapImportsAction = AddAction | RemoveAction;

function reducer(
  state: BackgroundedMapImportsState,
  action: BackgroundedMapImportsAction
) {
  const { type, payload } = action;

  switch (type) {
    case "add": {
      const { importId, styleId } = payload;

      if (state[styleId]) {
        console.warn(`CANNOT ADD ${styleId}, ALREADY EXISTS`);
        return state;
      }

      return { ...state, [styleId]: importId };
    }
    case "remove": {
      const { styleId } = payload;

      if (!state[styleId]) {
        console.warn(`CANNOT REMOVE ${styleId}, DOE NOT EXIST`);
        return state;
      }

      const updatedState = { ...state };

      delete updatedState[styleId];

      return updatedState;
    }
  }
}

const StateContext = React.createContext<BackgroundedMapImportsState>({});

const ActionsContext = React.createContext<
  React.Dispatch<BackgroundedMapImportsAction>
>((_action: BackgroundedMapImportsAction) => {});

const BackgroundedMapImportsProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [backgroundedMapImports, dispatch] = React.useReducer(reducer, {});

  return (
    <StateContext.Provider value={backgroundedMapImports}>
      <ActionsContext.Provider value={dispatch}>
        {children}
      </ActionsContext.Provider>
    </StateContext.Provider>
  );
};

export {
  StateContext as BackgroundedMapImportsStateContext,
  ActionsContext as BackgroundedMapImportsActionsContext,
  BackgroundedMapImportsProvider,
};
