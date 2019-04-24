// @flow
import * as React from "react";
import debug from "debug";
import hoistStatics from "hoist-non-react-statics";
import pick from "lodash/pick";

import { getDisplayName } from "../lib/utils";
import { getObservations } from "../api";

import type { LocationContextType } from "./LocationContext";

const log = debug("mapeo:ObservationsContext");

export type ObservationAttachment = {|
  id: string,
  type: string
|};

export type ObservationValue = {
  lat?: number,
  lon?: number,
  metadata?: {
    location?: LocationContextType
  },
  refs?: Array<{ id: string }>,
  attachments?: Array<ObservationAttachment>,
  tags: { [string]: any }
};

export type Observation = {
  id: string,
  version: string,
  createdAt: string,
  modifiedAt: string,
  userId: string,
  type: "observation",
  links: string[],
  schemaVersion: 4,
  value: ObservationValue
};

export type ObservationsMap = Map<string, Observation>;

export type ObservationsContext = {
  // A map of all observations in memory, by id
  observations: ObservationsMap,
  // Reload the observations from Mapeo Core
  reload: () => any,
  // True whilst loading from Mapeo Core
  loading: boolean,
  // Create a new observation, saving it to the server
  create: (value: ObservationValue) => Promise<Observation>,
  // Update an existing observation
  update: (id: string, value: ObservationValue) => Promise<Observation>,
  // If there is an error loading or saving an observation this will contain the
  // error object
  error?: Error
};

const defaultContext = {
  observations: new Map(),
  reload: () => {},
  create: () => Promise.resolve(),
  update: () => Promise.resolve(),
  loading: false
};

const {
  Provider,
  Consumer: ObservationsConsumer
} = React.createContext<ObservationsContext>(defaultContext);

type Props = {
  children: React.Node
};

/**
 * The ObservationsProvider is responsible for loading observations from Mapeo
 * Core and provides methods for creating, updating and deleting observations.
 */
class ObservationsProvider extends React.Component<Props, ObservationsContext> {
  state = {
    observations: new Map(),
    reload: this.reload.bind(this),
    create: this.create.bind(this),
    update: this.update.bind(this),
    loading: false
  };

  componentDidMount() {
    this.reload();
  }

  reload() {
    log("reload");
    this.setState({ loading: true });
    getObservations((err, obsList) => {
      if (err) return this.handleError(err);
      const observations = new Map(obsList.map(obs => [obs.id, obs]));
      this.setState({ observations, loading: false });
    });
  }

  create(value: ObservationValue) {
    const newObservation: Observation = {
      id: Math.random() + "",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      userId: "unknown",
      version: Math.random() + "",
      links: [],
      type: "observation",
      schemaVersion: 4,
      value: value
    };
    this.setState(state => {
      const cloned = new Map(this.state.observations);
      cloned.set(newObservation.id, newObservation);
      return { observations: cloned };
    });
    return Promise.resolve(newObservation);
  }

  update() {}

  handleError(error: Error) {
    log(error);
    this.setState({ error, loading: false });
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

// This HOC adds props from the observation context to the wrapped component. If
// called with no arguments, all properties are passed, or you can pass an array
// of prop names e.g. `["observations", "loading"] to only pass certain props.
export const withObservations = (keys?: Array<$Keys<ObservationsContext>>) => (
  WrappedComponent: any
) => {
  const WithObservations = (props: any) => (
    <ObservationsConsumer>
      {ctx => {
        const addedProps = keys ? pick(ctx, keys) : ctx;
        return <WrappedComponent {...props} {...addedProps} />;
      }}
    </ObservationsConsumer>
  );
  WithObservations.displayName = `WithObservations(${getDisplayName(
    WrappedComponent
  )})`;
  return hoistStatics(WithObservations, WrappedComponent);
};

export default {
  Provider: ObservationsProvider,
  Consumer: ObservationsConsumer
};
