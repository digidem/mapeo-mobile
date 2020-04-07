// @flow
import React from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  NativeEventEmitter,
  Text as RNText
} from "react-native";
import Svg, { Circle, Line, Text, Rect } from "react-native-svg";
import LocationContext from "../../context/LocationContext";
import ReactNativeHeading from "@cnakazawa/react-native-heading";

function useHeading() {
  // const headingRef = React.useRef(Infinity);
  const [heading, setHeading] = React.useState(0);

  React.useEffect(() => {
    const listener = new NativeEventEmitter(ReactNativeHeading);
    ReactNativeHeading.start(0.5);
    listener.addListener("headingUpdated", setHeading);
    return () => {
      ReactNativeHeading.stop();
      listener.removeAllListeners("headingUpdated");
    };
  }, []);

  return heading;
}

const c = {
  radarStroke: "#C6A438",
  label: "#C6A438",
  value: "white"
};

const s = {
  radarRadius: 120,
  w: 300,
  h: 300,
  radarStrokeWidth: 1.5,
  tick: 7,
  cardinalOffset: 5,
  cardinalSize: 20,
  interCardinalSize: 14
};

const cardinals = ["N", "E", "S", "W"];
const interCardinals = ["NE", "SE", "SW", "NW"];

const InfoLabel = ({ children }) => (
  <RNText
    style={{
      color: c.label,
      fontSize: 14,
      lineHeight: 14
    }}>
    {children}
  </RNText>
);
const InfoValue = ({ children }) => (
  <RNText
    style={{
      color: c.value,
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "bold"
    }}>
    {children}
  </RNText>
);

const InfoField = ({ children, style }) => (
  <View
    style={[
      {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 7,
        paddingHorizontal: 10
      },
      style
    ]}>
    {children}
  </View>
);

const Satellite = ({ cx, cy, type, status, rotation }) => {
  const color = status === "tracking" ? "#75FA4C" : "#7D83F7";
  const strokeWidth = status === "tracking" ? 2 : 0;
  switch (type) {
    case "GP":
      return (
        <Circle
          cx={cx}
          cy={cy}
          r={3}
          fill={color}
          strokeWidth={strokeWidth}
          stroke={color}
        />
      );
    case "GL":
      return (
        <Rect
          width={6}
          height={6}
          x={cx - 3}
          y={cy - 3}
          fill={color}
          strokeWidth={strokeWidth}
          stroke={color}
          rotation={rotation}
          origin={`${cx},${cy}`}
        />
      );
    case "GA":
      return (
        <>
          <Line
            x1={cx}
            y1={cy - 4}
            x2={cx}
            y2={cy + 4}
            fill={color}
            stroke={color}
            strokeWidth={2}
            rotation={rotation}
            origin={`${cx},${cy}`}
          />
          <Line
            x1={cx - 4}
            y1={cy}
            x2={cx + 4}
            y2={cy}
            fill={color}
            stroke={color}
            strokeWidth={2}
            rotation={rotation}
            origin={`${cx},${cy}`}
          />
        </>
      );
    case "BD":
      return (
        <>
          <Line
            x1={cx - 3}
            y1={cy - 3}
            x2={cx + 3}
            y2={cy + 3}
            fill={color}
            stroke={color}
            strokeWidth={2}
            rotation={rotation}
            origin={`${cx},${cy}`}
          />
          <Line
            x1={cx + 3}
            y1={cy - 3}
            x2={cx - 3}
            y2={cy + 3}
            fill={color}
            stroke={color}
            strokeWidth={2}
            rotation={rotation}
            origin={`${cx},${cy}`}
          />
        </>
      );
    default:
      console.warn("Unknown type", type);
  }
  return null;
};

const RadarSatellites = React.memo(({ satellites, rotation = 0 }) => {
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${s.w} ${s.h}`}>
      {satellites.map(d => {
        const cx =
          s.w / 2 +
          Math.cos((d.azimuth / 180) * Math.PI - Math.PI / 2) *
            elevationToRadius(d.elevation);
        const cy =
          s.w / 2 +
          Math.sin((d.azimuth / 180) * Math.PI - Math.PI / 2) *
            elevationToRadius(d.elevation);
        return (
          <React.Fragment key={d.prn + d.systemId}>
            <Satellite
              cx={cx}
              cy={cy}
              type={d.systemId}
              status={d.status}
              rotation={-rotation}
            />
            <Text
              x={cx + 3}
              y={cy - 6}
              fontSize={8}
              rotation={-rotation}
              origin={`${cx},${cy}`}
              fill="white">
              {d.prn}
            </Text>
          </React.Fragment>
        );
      })}
    </Svg>
  );
});

const RadarBackground = React.memo(() => {
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox={`0 0 ${s.w} ${s.h}`}>
      <Circle
        cx={s.w / 2}
        cy={s.w / 2}
        r={s.radarRadius}
        fill="none"
        stroke={c.radarStroke}
        strokeWidth={s.radarStrokeWidth}></Circle>
      <Circle
        cx={s.w / 2}
        cy={s.w / 2}
        r={(s.radarRadius / 3) * 2}
        fill="none"
        stroke={c.radarStroke}
        strokeWidth={s.radarStrokeWidth}></Circle>
      <Circle
        cx={s.w / 2}
        cy={s.w / 2}
        r={s.radarRadius / 3}
        fill="none"
        stroke={c.radarStroke}
        strokeWidth={s.radarStrokeWidth}></Circle>
      <Line
        x1={s.w / 2}
        y1={s.h / 2 - s.radarRadius}
        x2={s.w / 2}
        y2={s.h / 2 + s.radarRadius}
        stroke={c.radarStroke}
        strokeWidth={s.radarStrokeWidth}></Line>
      <Line
        y1={s.h / 2}
        x1={s.w / 2 - s.radarRadius}
        y2={s.h / 2}
        x2={s.w / 2 + s.radarRadius}
        stroke={c.radarStroke}
        strokeWidth={s.radarStrokeWidth}></Line>
      {new Array(16).fill().map((_, i) => (
        <Line
          key={i}
          x1={s.w / 2}
          y1={s.h / 2 - s.radarRadius}
          x2={s.w / 2}
          y2={s.h / 2 - s.radarRadius + s.tick}
          rotation={i * 22.5}
          origin={s.w / 2 + "," + s.h / 2}
          stroke={c.radarStroke}
          strokeWidth={s.radarStrokeWidth}></Line>
      ))}
      {cardinals.map((c, i) => (
        <Text
          key={i}
          fill="white"
          x={s.w / 2}
          y={s.h / 2 - s.radarRadius - s.cardinalOffset}
          fontSize={s.cardinalSize}
          rotation={i * 90}
          origin={s.w / 2 + "," + s.h / 2}
          fontWeight="bold"
          textAnchor="middle">
          {c}
        </Text>
      ))}
      {interCardinals.map((c, i) => (
        <Text
          key={i}
          fill="white"
          x={s.w / 2}
          y={s.h / 2 - s.radarRadius - s.cardinalOffset}
          fontSize={s.interCardinalSize}
          rotation={i * 90 + 45}
          origin={s.w / 2 + "," + s.h / 2}
          fontWeight="bold"
          textAnchor="middle">
          {c}
        </Text>
      ))}
    </Svg>
  );
});

function elevationToRadius(e) {
  // Degrees:
  // 0° has radius of 110
  // 90° has radius of 0

  return s.radarRadius * (1 - e / 90);
}

function useSatellites() {
  const ref = React.useRef([]);
  const { gps } = React.useContext(LocationContext);
  const [sats, setSats] = React.useState([]);

  React.useEffect(() => {
    gps.on("GSV", () => {
      // This event fires every time an NMEA message comes through, we only want
      // to update when the satellites in view actually changes
      const newSats = gps.state.satsVisible || [];
      if (newSats === ref.current) return;
      ref.current = newSats;
      setSats(newSats);
    });
    return () => gps.off("GSV");
  }, [gps]);

  return sats;
}

const Scanner = ({ diameter = 300 }: { diameter: number }) => {
  const heading = useHeading();
  const satellites = useSatellites();

  return (
    <View
      style={{
        position: "relative",
        flex: 1,
        alignSelf: "stretch",
        alignItems: "center",
        minHeight: 300
      }}>
      <View
        style={{
          transform: [{ rotate: -heading + "deg" }, { translateX: 0 }],
          width: diameter,
          height: diameter
        }}>
        <RadarBackground />
        <RadarSatellites satellites={satellites} rotation={-heading} />
      </View>
      <InfoField style={{ top: 0, right: 0 }}>
        <InfoLabel>Heading</InfoLabel>
        <InfoValue>{heading + "°"}</InfoValue>
      </InfoField>
      <InfoField style={{ bottom: 0, right: 0 }}>
        <InfoValue>18/31</InfoValue>
        <InfoLabel>Fix/Sats</InfoLabel>
      </InfoField>
      <InfoField style={{ bottom: 0, left: 0 }}>
        <InfoValue>10</InfoValue>
        <InfoLabel>Error (m)</InfoLabel>
      </InfoField>
    </View>
  );
};

export default Scanner;
