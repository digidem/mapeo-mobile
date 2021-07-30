/* eslint-env jest/globals */
import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { ReactTestInstance } from "react-test-renderer";
import { render } from "../../lib/test-utils";
import DdForm, { messages as ddFormMessages } from "../ManualGpsScreen/DdForm";
import DmsForm, {
  messages as dmsFormMessages,
} from "../ManualGpsScreen/DmsForm";
import UtmForm, {
  messages as utmFormMessages,
} from "../ManualGpsScreen/UtmForm";

const mockOnValueUpdate = jest.fn();

const getDisplayedSelectLabel = (element: ReactTestInstance): string | void =>
  element.props.items[element.props.selectedIndex]?.label;

beforeEach(() => {
  mockOnValueUpdate.mockReset();
});

describe("DdForm", () => {
  const invalidCoordinatesError = new Error(
    ddFormMessages.invalidCoordinates.defaultMessage
  );

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

    const { getByTestId } = render(
      <DdForm
        onValueUpdate={mockOnValueUpdate}
        coords={positiveOnlyCoordinates}
      />
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

    const { getByTestId } = render(
      <DdForm
        onValueUpdate={mockOnValueUpdate}
        coords={negativeOnlyCoordinates}
      />
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

    const { getByTestId } = render(
      <DdForm onValueUpdate={mockOnValueUpdate} coords={initialCoordinates} />
    );

    const latCardinalityElement = getByTestId("DdForm-lat-select");

    fireEvent(latCardinalityElement, "onValueChange", "S");

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lat: -90 },
    });

    fireEvent(latCardinalityElement, "onValueChange", "N");

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lat: 90 },
    });
  });

  test("calls onValueUpdate correctly when changing longitude cardinality", () => {
    const initialCoordinates = { lat: 0, lon: 90 };

    const { getByTestId } = render(
      <DdForm onValueUpdate={mockOnValueUpdate} coords={initialCoordinates} />
    );

    const lonCardinalityElement = getByTestId("DdForm-lon-select");

    fireEvent(lonCardinalityElement, "onValueChange", "W");

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lon: -90 },
    });

    fireEvent(lonCardinalityElement, "onValueChange", "E");

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lon: 90 },
    });
  });

  test("provides invalid coordinate error when latitude is not within valid range", () => {
    const outOfRangeValue = 90 + 1;
    const initialCoordinates = { lat: 0, lon: 0 };

    const { getByLabelText } = render(
      <DdForm onValueUpdate={mockOnValueUpdate} coords={initialCoordinates} />
    );

    const latInputElement = getByLabelText(
      ddFormMessages.latInputLabel.defaultMessage
    );

    fireEvent.changeText(latInputElement, outOfRangeValue.toString());

    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      error: invalidCoordinatesError,
    });
  });

  test("provides invalid coordinate error when longitude is not within valid range", () => {
    const outOfRangeValue = 180 + 1;
    const initialCoordinates = { lat: 0, lon: 0 };

    const { getByLabelText } = render(
      <DdForm onValueUpdate={mockOnValueUpdate} coords={initialCoordinates} />
    );

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

    const { getByTestId } = render(
      <DmsForm
        onValueUpdate={mockOnValueUpdate}
        coords={positiveOnlyCoordinates}
      />
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

    const { getByTestId } = render(
      <DmsForm
        onValueUpdate={mockOnValueUpdate}
        coords={negativeOnlyCoordinates}
      />
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

    const { getByTestId } = render(
      <DmsForm onValueUpdate={mockOnValueUpdate} coords={initialCoordinates} />
    );

    const latCardinalityElement = getByTestId("DmsInputGroup-lat-select");

    fireEvent(latCardinalityElement, "onValueChange", "S");

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lat: -90 },
    });

    fireEvent(latCardinalityElement, "onValueChange", "N");

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lat: 90 },
    });
  });

  test("calls onValueUpdate correctly when changing longitude cardinality", () => {
    const initialCoordinates = { lat: 0, lon: 90 };

    const { getByTestId } = render(
      <DmsForm onValueUpdate={mockOnValueUpdate} coords={initialCoordinates} />
    );

    const lonCardinalityElement = getByTestId("DmsInputGroup-lon-select");

    fireEvent(lonCardinalityElement, "onValueChange", "W");

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lon: -90 },
    });

    fireEvent(lonCardinalityElement, "onValueChange", "E");

    expect(mockOnValueUpdate).toHaveBeenCalledWith({
      coords: { ...initialCoordinates, lon: 90 },
    });
  });

  test("provides invalid coordinate error when degrees is not within valid ranges", () => {
    const outOfRangeValues = {
      lat: 91,
      lon: 181,
    };

    const initialCoordinates = { lat: 0, lon: 0 };

    const { getByLabelText } = render(
      <DmsForm onValueUpdate={mockOnValueUpdate} coords={initialCoordinates} />
    );

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
      coords: { lat: 0, lon: 0 },
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

    const { getByLabelText } = render(
      <DmsForm onValueUpdate={mockOnValueUpdate} coords={initialCoordinates} />
    );

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
      coords: { lat: 0, lon: 0 },
    });

    // Test lon input
    fireEvent.changeText(lonMinutesInputElement, outOfRangeValue.toString());
    expect(mockOnValueUpdate).toHaveBeenLastCalledWith({
      error: invalidCoordinatesError,
    });
  });

  test("provides invalid coordinate error when seconds is not within valid range", () => {
    const outOfRangeValue = 60;

    const initialCoordinates = { lat: 0, lon: 0 };

    const { getByLabelText } = render(
      <DmsForm onValueUpdate={mockOnValueUpdate} coords={initialCoordinates} />
    );

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
      coords: { lat: 0, lon: 0 },
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
