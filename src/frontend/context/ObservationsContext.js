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
  observations: ObservationsMap,
  reload: () => void,
  loading: boolean,
  create: (value: ObservationValue) => Promise<Observation>,
  update: (id: string, value: ObservationValue) => Promise<Observation>,
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

export const withObservations = (keys?: Array<$Keys<ObservationsContext>>) => (
  WrappedComponent: any
) => {
  const WithDraft = (props: any) => (
    <ObservationsConsumer>
      {ctx => {
        const addedProps = keys ? pick(ctx, keys) : ctx;
        return <WrappedComponent {...props} {...addedProps} />;
      }}
    </ObservationsConsumer>
  );
  WithDraft.displayName = `WithDraft(${getDisplayName(WrappedComponent)})`;
  return hoistStatics(WithDraft, WrappedComponent);
};

export default {
  Provider: ObservationsProvider,
  Consumer: ObservationsConsumer
};
