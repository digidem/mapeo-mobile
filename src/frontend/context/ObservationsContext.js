// @flow
import * as React from "react";
import { getObservations } from "../api";
import debug from "debug";

const log = debug("mapeo:ObservationsContext");

export type ObservationAttachment = {|
  id: string,
  type: string
|};

export type ObservationValue = {
  lat?: number,
  lon?: number,
  metadata?: {},
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

export type ObservationsMap = {
  [id: string]: Observation
};

type ObservationsContext = {
  observations: ObservationsMap,
  reload: () => void,
  loading: boolean,
  error?: Error
};

const defaultContext = {
  observations: {},
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
    observations: {},
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
      const observations = obsList.reduce(idReducer, {});
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

function idReducer(acc, obs) {
  acc[obs.id] = obs;
  return acc;
}
