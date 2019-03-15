// @flow
import * as React from "react";
import ObservationsApi from "../api/observations";
import debug from "debug";

const log = debug("mapeo:ObservationsContext");

type ObservationContext = {
  observations: {},
  reload: () => void
};

const defaultContext = {
  observations: {},
  reload: () => {}
};

const {
  Provider,
  Consumer: ObservationsConsumer
} = React.createContext<ObservationContext>(defaultContext);

type Props = {
  children: React.Node
};

type State = {
  observations: {},
  reload: () => void,
  loading: boolean,
  error?: Error
};

class ObservationsProvider extends React.Component<Props, State> {
  state = {
    observations: {},
    reload: this.reload,
    loading: false
  };

  api: typeof ObservationsApi;

  constructor(props: Props) {
    super(props);
    this.api = new ObservationsApi();
  }

  componentDidMount() {
    this.reload();
  }

  reload = () => {
    log("reload");
    this.setState({ loading: true });
    this.api.list((err, obsList) => {
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

export const withObservations = (WrappedComponent: any) => {
  const WithObservations = (props: any) => (
    <ObservationsConsumer>
      {observationsContext => (
        <WrappedComponent {...props} {...observationsContext} />
      )}
    </ObservationsConsumer>
  );
  WithObservations.displayName = `WithObservations(${getDisplayName(
    WrappedComponent
  )})`;
  return WithObservations;
};

export default {
  Provider: ObservationsProvider,
  Consumer: ObservationsConsumer
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function idReducer(acc, obs) {
  acc[obs.id] = obs;
  return acc;
}
