/* eslint-env jest/globals */
import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { ReactTestInstance } from "react-test-renderer";
import { Position } from "mapeo-schema";

import { render } from "../../lib/test-utils";
import LocationContext, {
  LocationContextType,
} from "../../context/LocationContext";
import DdForm, { messages as ddFormMessages } from "../ManualGpsScreen/DdForm";
import DmsForm, {
  messages as dmsFormMessages,
} from "../ManualGpsScreen/DmsForm";
import UtmForm, {
  messages as utmFormMessages,
} from "../ManualGpsScreen/UtmForm";

type Coordinates = { lat: number; lon: number };

const mockOnValueUpdate = jest.fn();

const generatePositionValue = ({ lat, lon }: Coordinates): Position => ({
  timestamp: new Date().getTime(),
  mocked: false,
  coords: {
    altitude: Math.random(),
    heading: Math.random(),
    longitude: lon,
    speed: Math.random(),
    latitude: lat,
    accuracy: Math.random(),
  },
});

const getDisplayedSelectLabel = (element: ReactTestInstance): string | void =>
  element.props.items[element.props.selectedIndex]?.label;
const getDisplayedSelectValue = (element: ReactTestInstance): string | void =>
  element.props.items[element.props.selectedIndex]?.value;

beforeEach(() => {
  mockOnValueUpdate.mockReset();
});

const renderWithLocation = (
  component: React.ReactNode,
  location: LocationContextType
) =>
  render(
    <LocationContext.Provider value={location}>
      {component}
    </LocationContext.Provider>
  );

describe("DdForm", () => {
  const invalidCoordinatesError = new Error(
    ddFormMessages.invalidCoordinates.defaultMessage
  );

  const initializeCoordinateFields = (
    queryOperation: (matcher: string | RegExp) => ReactTestInstance,
    coordinates: Coordinates
  ) => {
    const latInputElement = queryOperation(
      ddFormMessages.latInputLabel.defaultMessage
    );
    const lonInputElement = queryOperation(
      ddFormMessages.lonInputLabel.defaultMessage
    );
    fireEvent.changeText(latInputElement, coordinates.lat.toString());
    fireEvent.changeText(lonInputElement, coordinates.lon.toString());
  };

  test("renders the correct inputs", () => {
    const { queryByTestId, queryByLabelText } = render(
      <DdForm onValueUpdate={mockOnValueUpdate} />
    );

    // Ideally would use queryByLabelText here
    // but can't due to https://github.com/callstack/react-native-testing-library/issues/500
    const latSelectElement = queryByTestId("DdForm-lat-select");
    const lonSelectElement = queryByTestId("DdForm-lon-select");

    const latInputElement = queryByLabelText(
      ddFormMessages.latInputLabel.defaultMessage
    );
    const lonInputElement = queryByLabelText(
      ddFormMessages.lonInputLabel.defaultMessage
    );

    expect(latInputElement).toBeTruthy();
    expect(latSelectElement).toBeTruthy();
    expect(lonInputElement).toBeTruthy();
    expect(lonSelectElement).toBeTruthy();
  });

  test("has correct initial cardinalities for positive coordinate values", () => {
    const positiveOnlyCoordinates = { lat: 90, lon: 90 };

    const { getByTestId } = renderWithLocation(
      <DdForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(positiveOnlyCoordinates) }
    );

    const latCardinalityElement = getByTestId("DdForm-lat-select");
    const lonCardinalityElement = getByTestId("DdForm-lon-select");

    const latCardinalityValue = getDisplayedSelectLabel(latCardinalityElement);
    const lonCardinalityValue = getDisplayedSelectLabel(lonCardinalityElement);

    expect(latCardinalityValue).toBe(ddFormMessages.north.defaultMessage);
    expect(lonCardinalityValue).toBe(ddFormMessages.east.defaultMessage);
  });

  test("has correct initial cardinalities for negative coordinate values", () => {
    const negativeOnlyCoordinates = { lat: -90, lon: -90 };

    const { getByTestId } = renderWithLocation(
      <DdForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(negativeOnlyCoordinates) }
    );

    const latCardinalityElement = getByTestId("DdForm-lat-select");
    const lonCardinalityElement = getByTestId("DdForm-lon-select");

    const latCardinalityValue = getDisplayedSelectLabel(latCardinalityElement);
    const lonCardinalityValue = getDisplayedSelectLabel(lonCardinalityElement);

    expect(latCardinalityValue).toBe(ddFormMessages.south.defaultMessage);
    expect(lonCardinalityValue).toBe(ddFormMessages.west.defaultMessage);
  });

  test("does not permit negative values in text inputs", () => {
    const emptyInputValue = "";

    const { getByLabelText } = render(
      <DdForm onValueUpdate={mockOnValueUpdate} />
    );

    const latInputElement = getByLabelText(
      ddFormMessages.latInputLabel.defaultMessage
    );
    const lonInputElement = getByLabelText(
      ddFormMessages.lonInputLabel.defaultMessage
    );

    fireEvent.changeText(latInputElement, "-");
    fireEvent.changeText(lonInputElement, "-");

    expect(latInputElement.props.value).toBe(emptyInputValue);
    expect(lonInputElement.props.value).toBe(emptyInputValue);
  });

  test("calls onValueUpdate correctly when changing latitude cardinality", () => {
    const initialCoordinates = { lat: 90, lon: 0 };

    const { getByLabelText, getByTestId } = renderWithLocation(
      <DdForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(initialCoordinates) }
    );

    initializeCoordinateFields(getByLabelText, initialCoordinates);

    const latCardinalityElement = getByTestId("DdForm-lat-select");

    const initialCardinalityValue = getDisplayedSelectValue(
      latCardinalityElement
    );
    const alternativeCardinalityValue =
      initialCardinalityValue === "N" ? "S" : "N";

    fireEvent(
      latCardinalityElement,
      "onValueChange",
      alternativeCardinalityValue
    );

    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      coords: { ...initialCoordinates, lat: initialCoordinates.lat * -1 },
    });

    fireEvent(latCardinalityElement, "onValueChange", initialCardinalityValue);

    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      coords: { ...initialCoordinates, lat: initialCoordinates.lat },
    });
  });

  test("calls onValueUpdate correctly when changing longitude cardinality", () => {
    const initialCoordinates = { lat: 0, lon: 90 };

    const { getByLabelText, getByTestId } = renderWithLocation(
      <DdForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(initialCoordinates) }
    );

    initializeCoordinateFields(getByLabelText, initialCoordinates);

    const lonCardinalityElement = getByTestId("DdForm-lon-select");

    const initialCardinalityValue = getDisplayedSelectValue(
      lonCardinalityElement
    );
    const alternativeCardinalityValue =
      initialCardinalityValue === "E" ? "W" : "E";

    fireEvent(
      lonCardinalityElement,
      "onValueChange",
      alternativeCardinalityValue
    );

    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      coords: { ...initialCoordinates, lon: initialCoordinates.lon * -1 },
    });

    fireEvent(lonCardinalityElement, "onValueChange", initialCardinalityValue);

    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      coords: { ...initialCoordinates, lon: initialCoordinates.lon },
    });
  });

  test("provides invalid coordinate error when latitude is not within valid range", () => {
    const initialCoordinates = { lat: 0, lon: 0 };
    const outOfRangeValue = 90 + 1;

    const { getByLabelText } = renderWithLocation(
      <DdForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(initialCoordinates) }
    );

    initializeCoordinateFields(getByLabelText, initialCoordinates);

    const latInputElement = getByLabelText(
      ddFormMessages.latInputLabel.defaultMessage
    );

    fireEvent.changeText(latInputElement, outOfRangeValue.toString());

    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      error: invalidCoordinatesError,
    });
  });

  test("provides invalid coordinate error when longitude is not within valid range", () => {
    const initialCoordinates = { lat: 0, lon: 0 };
    const outOfRangeValue = 180 + 1;

    const { getByLabelText } = renderWithLocation(
      <DdForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(initialCoordinates) }
    );

    initializeCoordinateFields(getByLabelText, initialCoordinates);

    const lonInputElement = getByLabelText(
      ddFormMessages.lonInputLabel.defaultMessage
    );

    fireEvent.changeText(lonInputElement, outOfRangeValue.toString());

    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      error: invalidCoordinatesError,
    });
  });
});

describe("DmsForm", () => {
  const invalidCoordinatesError = new Error(
    dmsFormMessages.invalidCoordinates.defaultMessage
  );

  const initializeCoordinateFields = (
    queryOperation: (matcher: string | RegExp) => ReactTestInstance,
    coordinates: {
      lat?: {
        degrees: number;
        minutes: number;
        seconds: number;
      };
      lon?: {
        degrees: number;
        minutes: number;
        seconds: number;
      };
    }
  ) => {
    // Todo: Make these translation-friendly
    const latDegreesInputElement = queryOperation("Latitude degrees input");
    const latMinutesInputElement = queryOperation("Latitude minutes input");
    const latSecondsInputElement = queryOperation("Latitude seconds input");

    // TODO: Make these translation-friendly
    const lonDegreesInputElement = queryOperation("Longitude degrees input");
    const lonMinutesInputElement = queryOperation("Longitude minutes input");
    const lonSecondsInputElement = queryOperation("Longitude seconds input");

    if (coordinates.lat) {
      fireEvent.changeText(
        latDegreesInputElement,
        coordinates.lat.degrees.toString()
      );
      fireEvent.changeText(
        latMinutesInputElement,
        coordinates.lat.minutes.toString()
      );
      fireEvent.changeText(
        latSecondsInputElement,
        coordinates.lat.seconds.toString()
      );
    }

    if (coordinates.lon) {
      fireEvent.changeText(
        lonDegreesInputElement,
        coordinates.lon.degrees.toString()
      );
      fireEvent.changeText(
        lonMinutesInputElement,
        coordinates.lon.minutes.toString()
      );
      fireEvent.changeText(
        lonSecondsInputElement,
        coordinates.lon.seconds.toString()
      );
    }
  };

  test("renders the correct inputs", () => {
    const { queryByLabelText, queryByTestId } = render(
      <DmsForm onValueUpdate={mockOnValueUpdate} />
    );

    // TODO: Make these translation-friendly
    const latDegreesInputElement = queryByLabelText("Latitude degrees input");
    const latMinutesInputElement = queryByLabelText("Latitude minutes input");
    const latSecondsInputElement = queryByLabelText("Latitude seconds input");

    const latSelectElement = queryByTestId("DmsInputGroup-lat-select");

    // TODO: Make these translation-friendly
    const lonDegreesInputElement = queryByLabelText("Longitude degrees input");
    const lonMinutesInputElement = queryByLabelText("Longitude minutes input");
    const lonSecondsInputElement = queryByLabelText("Longitude seconds input");

    const lonSelectElement = queryByTestId("DmsInputGroup-lon-select");

    expect(latDegreesInputElement).toBeTruthy();
    expect(latMinutesInputElement).toBeTruthy();
    expect(latSecondsInputElement).toBeTruthy();
    expect(latSelectElement).toBeTruthy();

    expect(lonDegreesInputElement).toBeTruthy();
    expect(lonMinutesInputElement).toBeTruthy();
    expect(lonSecondsInputElement).toBeTruthy();
    expect(lonSelectElement).toBeTruthy();
  });

  test("has correct initial cardinalities for positive coordinate values", () => {
    const positiveOnlyCoordinates = { lat: 90, lon: 90 };

    const { getByTestId } = renderWithLocation(
      <DmsForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(positiveOnlyCoordinates) }
    );

    const latCardinalityElement = getByTestId("DmsInputGroup-lat-select");
    const lonCardinalityElement = getByTestId("DmsInputGroup-lon-select");

    const latCardinalityValue = getDisplayedSelectLabel(latCardinalityElement);
    const lonCardinalityValue = getDisplayedSelectLabel(lonCardinalityElement);

    expect(latCardinalityValue).toBe(dmsFormMessages.north.defaultMessage);
    expect(lonCardinalityValue).toBe(dmsFormMessages.east.defaultMessage);
  });

  test("has correct initial cardinalities for negative coordinate values", () => {
    const negativeOnlyCoordinates = { lat: -90, lon: -90 };

    const { getByTestId } = renderWithLocation(
      <DmsForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(negativeOnlyCoordinates) }
    );

    const latCardinalityElement = getByTestId("DmsInputGroup-lat-select");
    const lonCardinalityElement = getByTestId("DmsInputGroup-lon-select");

    const latCardinalityValue = getDisplayedSelectLabel(latCardinalityElement);
    const lonCardinalityValue = getDisplayedSelectLabel(lonCardinalityElement);

    expect(latCardinalityValue).toBe(dmsFormMessages.south.defaultMessage);
    expect(lonCardinalityValue).toBe(dmsFormMessages.west.defaultMessage);
  });

  test("does not permit negative values in text inputs", () => {
    const emptyInputValue = "";

    const { getByLabelText } = render(
      <DmsForm onValueUpdate={mockOnValueUpdate} />
    );

    const latDegreesInputElement = getByLabelText("Latitude degrees input");
    const latMinutesInputElement = getByLabelText("Latitude minutes input");
    const latSecondsInputElement = getByLabelText("Latitude seconds input");

    const lonDegreesInputElement = getByLabelText("Longitude degrees input");
    const lonMinutesInputElement = getByLabelText("Longitude minutes input");
    const lonSecondsInputElement = getByLabelText("Longitude seconds input");

    [
      latDegreesInputElement,
      latMinutesInputElement,
      latSecondsInputElement,
      lonDegreesInputElement,
      lonMinutesInputElement,
      lonSecondsInputElement,
    ].forEach(element => {
      fireEvent.changeText(element, "-");
      expect(element.props.value).toBe(emptyInputValue);
    });
  });

  test("calls onValueUpdate correctly when changing latitude cardinality", () => {
    const initialCoordinates = { lat: 90, lon: 0 };

    const { getByLabelText, getByTestId } = renderWithLocation(
      <DmsForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(initialCoordinates) }
    );

    initializeCoordinateFields(getByLabelText, {
      lat: { degrees: initialCoordinates.lat, minutes: 0, seconds: 0 },
      lon: { degrees: initialCoordinates.lon, minutes: 0, seconds: 0 },
    });

    const latCardinalityElement = getByTestId("DmsInputGroup-lat-select");

    const initialCardinalityValue = getDisplayedSelectValue(
      latCardinalityElement
    );
    const alternativeCardinalityValue =
      initialCardinalityValue === "N" ? "S" : "N";

    fireEvent(
      latCardinalityElement,
      "onValueChange",
      alternativeCardinalityValue
    );

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lat: initialCoordinates.lat * -1 },
    });

    fireEvent(latCardinalityElement, "onValueChange", initialCardinalityValue);

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lat: initialCoordinates.lat },
    });
  });

  test("calls onValueUpdate correctly when changing longitude cardinality", () => {
    const initialCoordinates = { lat: 0, lon: 90 };

    const { getByLabelText, getByTestId } = renderWithLocation(
      <DmsForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(initialCoordinates) }
    );

    initializeCoordinateFields(getByLabelText, {
      lat: { degrees: initialCoordinates.lat, minutes: 0, seconds: 0 },
      lon: { degrees: initialCoordinates.lon, minutes: 0, seconds: 0 },
    });

    const lonCardinalityElement = getByTestId("DmsInputGroup-lon-select");

    const initialCardinalityValue = getDisplayedSelectValue(
      lonCardinalityElement
    );
    const alternativeCardinalityValue =
      initialCardinalityValue === "N" ? "S" : "N";

    fireEvent(
      lonCardinalityElement,
      "onValueChange",
      alternativeCardinalityValue
    );

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lon: initialCoordinates.lon * -1 },
    });

    fireEvent(lonCardinalityElement, "onValueChange", initialCardinalityValue);

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lon: initialCoordinates.lon },
    });
  });

  test("provides invalid coordinate error when degrees is not within valid ranges", () => {
    const initialCoordinates = { lat: 0, lon: 0 };
    const outOfRangeValues = {
      lat: 91,
      lon: 181,
    };

    const { getByLabelText } = renderWithLocation(
      <DmsForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(initialCoordinates) }
    );

    initializeCoordinateFields(getByLabelText, {
      lat: { degrees: initialCoordinates.lat, minutes: 0, seconds: 0 },
      lon: { degrees: initialCoordinates.lon, minutes: 0, seconds: 0 },
    });

    // TODO: Make these translation-friendly
    const latDegreesInputElement = getByLabelText("Latitude degrees input");
    const lonDegreesInputElement = getByLabelText("Longitude degrees input");

    // Test lat input
    fireEvent.changeText(
      latDegreesInputElement,
      outOfRangeValues.lat.toString()
    );
    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      error: invalidCoordinatesError,
    });

    // Reset coordinates before testing next degrees input
    fireEvent.changeText(latDegreesInputElement, "0");
    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      coords: initialCoordinates,
    });

    // Test lon input
    fireEvent.changeText(
      lonDegreesInputElement,
      outOfRangeValues.lon.toString()
    );
    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      error: invalidCoordinatesError,
    });
  });

  test("provides invalid coordinate error when minutes is not within valid range", () => {
    const outOfRangeValue = 60;
    const initialCoordinates = { lat: 0, lon: 0 };

    const { getByLabelText } = renderWithLocation(
      <DmsForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(initialCoordinates) }
    );

    initializeCoordinateFields(getByLabelText, {
      lat: { degrees: initialCoordinates.lat, minutes: 0, seconds: 0 },
      lon: { degrees: initialCoordinates.lon, minutes: 0, seconds: 0 },
    });

    const latMinutesInputElement = getByLabelText("Latitude minutes input");
    const lonMinutesInputElement = getByLabelText("Longitude minutes input");

    // Test lat input
    fireEvent.changeText(latMinutesInputElement, outOfRangeValue.toString());
    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      error: invalidCoordinatesError,
    });

    // Reset coordinates before testing next minutes input
    fireEvent.changeText(latMinutesInputElement, "0");
    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      coords: initialCoordinates,
    });

    // Test lon input
    fireEvent.changeText(lonMinutesInputElement, outOfRangeValue.toString());
    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      error: invalidCoordinatesError,
    });
  });

  test("provides invalid coordinate error when seconds is not within valid range", () => {
    const initialCoordinates = { lat: 0, lon: 0 };
    const outOfRangeValue = 60;

    const { getByLabelText } = renderWithLocation(
      <DmsForm onValueUpdate={mockOnValueUpdate} />,
      { savedPosition: generatePositionValue(initialCoordinates) }
    );

    initializeCoordinateFields(getByLabelText, {
      lat: { degrees: initialCoordinates.lat, minutes: 0, seconds: 0 },
      lon: { degrees: initialCoordinates.lon, minutes: 0, seconds: 0 },
    });

    const latSecondsInputElement = getByLabelText("Latitude seconds input");
    const lonSecondsInputElement = getByLabelText("Longitude seconds input");

    // Test lat input
    fireEvent.changeText(latSecondsInputElement, outOfRangeValue.toString());
    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      error: invalidCoordinatesError,
    });

    // Reset coordinates before testing next seconds input
    fireEvent.changeText(latSecondsInputElement, "0");
    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      coords: initialCoordinates,
    });

    // Test lon input
    fireEvent.changeText(lonSecondsInputElement, outOfRangeValue.toString());
    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      error: invalidCoordinatesError,
    });
  });
});

// TODO: add more tests for this
describe("UtmForm", () => {
  test("renders the correct inputs", () => {
    const { queryByLabelText } = render(
      <UtmForm onValueUpdate={mockOnValueUpdate} />
    );

    const zoneNumberInput = queryByLabelText(
      utmFormMessages.zoneNumber.defaultMessage
    );
    const zoneLetterInput = queryByLabelText(
      utmFormMessages.zoneLetter.defaultMessage
    );
    const eastingInput = queryByLabelText(
      utmFormMessages.easting.defaultMessage
    );
    const northingInput = queryByLabelText(
      utmFormMessages.northing.defaultMessage
    );

    expect(zoneNumberInput).toBeTruthy();
    expect(zoneLetterInput).toBeTruthy();
    expect(eastingInput).toBeTruthy();
    expect(northingInput).toBeTruthy();
  });
});

// TODO: Add tests for ManualGpsScreen
