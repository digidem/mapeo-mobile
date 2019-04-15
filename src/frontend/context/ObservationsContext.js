// @flow
import * as React from "react";
import { getObservations } from "../api";
import debug from "debug";

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

type ObservationsContext = {
  observations: ObservationsMap,
  reload: () => void,
  loading: boolean,
  error?: Error
};

const defaultContext = {
  observations: new Map(),
  reload: () => {},
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
    reload: this.reload,
    loading: false
  };

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    log("reload");
    this.setState({ loading: true });
    getObservations((err, obsList) => {
      if (err) return this.handleError(err);
      const observations = new Map(obsList.map(obs => [obs.id, obs]));
      this.setState({ observations, loading: false });
    });
  };

  handleError(error: Error) {
    log(error);
    this.setState({ error, loading: false });
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export default {
  Provider: ObservationsProvider,
  Consumer: ObservationsConsumer
};
