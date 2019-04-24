# App Context

Mapeo Mobile uses [React Context](https://reactjs.org/docs/context.html) to
manage state that is needed in components in different places in the component
hierarchy. The state is split into different areas so that components can
subscribe to only the pieces of global app state that they need:

- [Observations](#Observations)
- [Presets](#Presets)
- [Location](#Location)
- [Permissions](#Permissions)
- [Draft Observation](#Draft%20Observation)

The context must be "provided" by wrapping the app in `<Context.Provider>` and
a component can read the context via the `<Context.Consumer>` (see [Context API
docs](https://reactjs.org/docs/context.html#api)). The contexts we use provide
both values and methods to change the value. See the code for more detailed
comments about the internal APIs

## Observations

The ObservationsProvider is responsible for loading observations from Mapeo Core
and provides methods for creating, updating and deleting observations.

## Presets

The PresetsProvider is responsible for loading the preset and field definitions
from Mapeo Core and provides a method for matching a preset to a given
observation.

## Location

The LocationProvider provides details about the current device location based on
sensors including GPS. It must be included in the component heirarchy below the
PermissionsProvider, since it needs to read the permissions granted for device
location. There is no event we can listen to for when the user switches off
location (e.g. changes to airplane mode) so we use a timeout -> if we get not
new readings for 10 seconds then we check to see whether the user has turned off
location.

## Permissions

The PermissionsProvider is responsible for requesting app permissions and stores
the current status of the permissions granted by the user.

## Draft Observation

The DraftObservationProvider is used to manage the local state of any
observation that is being edited / created. It saves the state to local storage,
in order to recover from app crashes, or the app being forced closed. After a
draft has been saved or deleted from Mapeo Core it must be cleared before
creating a new draft.
