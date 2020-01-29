// @flow
import * as React from "react";
import { View, Text, Dimensions, BackHandler, StyleSheet } from "react-native";
import { TabView } from "react-native-tab-view";
import { useValues, clamp, between } from "react-native-redash";
import LottieView from "lottie-react-native";
import Animated, { Easing, Clock, Value } from "react-native-reanimated";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Octicon from "react-native-vector-icons/Octicons";
import getContrastRatio from "get-contrast-ratio";
import LinearGradient from "react-native-linear-gradient";

const {
  interpolate,
  Extrapolate,
  useCode,
  cond,
  set,
  or,
  not,
  onChange,
  block,
  startClock,
  eq,
  neq,
  timing
} = Animated;

/**
 * This helper will transition a value *from* zero, but returns a value back to
 * zero without any transition. Based on
 * https://github.com/wcandillon/react-native-redash/blob/1eb308e254e6ee0061887312f7f1b0669030bd83/src/Transitions.ts#L22-L55
 */
const withTransitionRight = (
  value: Animated.Node<number>,
  timingConfig = {}
) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    frameTime: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };
  const config = {
    toValue: new Value(0),
    duration: 250,
    easing: Easing.linear,
    ...timingConfig
  };
  return block([
    startClock(clock),
    cond(neq(config.toValue, value), [
      set(state.frameTime, 0),
      set(state.time, 0),
      set(state.finished, 0),
      set(config.toValue, value)
    ]),
    cond(
      eq(value, 0),
      [set(state.position, value)],
      timing(clock, state, config)
    ),
    state.position
  ]);
};

const IntroScreen = React.memo(
  ({
    index,
    position,
    routes,
    backgroundColor,
    title,
    description,
    animation
  }) => {
    const [
      focussed,
      blurred,
      focussing,
      blurring,
      animationProgress,
      clampedPosition,
      appearProgress,
      translateY
    ] = useValues([0, 1, 1, 0, 0, 0, 0, 0], []);

    useCode(
      () => [
        set(clampedPosition, clamp(position, 0, routes.length - 1)),
        set(focussed, between(clampedPosition, index - 0.05, index + 0.05)),
        set(blurred, not(between(clampedPosition, index - 0.95, index + 0.95))),
        // The screen is blurring when it is moving between focussed state and
        // blurred state and focussing when moving from blurred to focussed
        onChange(
          focussed,
          cond(eq(focussed, 0), set(blurring, 1), set(focussing, 0))
        ),
        onChange(
          blurred,
          cond(eq(blurred, 0), set(focussing, 1), set(blurring, 0))
        ),
        // We want "in" animations to happen just after the screen comes into
        // focus, but we don't want to "out" animation to happen until the screen
        // is blurred
        set(
          animationProgress,
          withTransitionRight(or(focussed, blurring), {
            duration: (animation.op / animation.fr) * 1000
          })
        ),
        set(
          appearProgress,
          withTransitionRight(or(focussed, blurring), {
            duration: 300,
            easing: Easing.bezier(0.0, 0.0, 0.2, 1)
          })
        ),
        set(
          translateY,
          interpolate(appearProgress, {
            inputRange: [0, 1],
            outputRange: [100, 0]
          })
        )
      ],
      [position]
    );

    const textColor =
      getContrastRatio(backgroundColor, "white") <= 3 ? "black" : "white";

    return (
      <View
        style={{
          flex: 1,
          backgroundColor,
          paddingBottom: 100
        }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LottieView
            style={{}}
            resizeMode="contain"
            source={animation}
            progress={animationProgress}
          />
        </View>
        <Animated.View
          style={{
            padding: 10,
            flex: 0,
            opacity: appearProgress,
            transform: [{ translateY }]
          }}>
          <Text
            style={{
              color: textColor,
              fontWeight: "700",
              fontSize: 22,
              textAlign: "center",
              marginBottom: 5
            }}>
            {title}
          </Text>
          <Text
            style={{
              color: textColor,
              fontWeight: "400",
              fontSize: 18,
              textAlign: "center",
              lineHeight: 18 * 1.4
            }}>
            {description}
          </Text>
        </Animated.View>
      </View>
    );
  }
);

const initialLayout = { width: Dimensions.get("window").width };
const dotSize = 10;
const dotSpacing = 10;

const TabBar = React.memo(
  ({ index, position, routes, jumpTo, onPressComplete }) => {
    const translateX = interpolate(position, {
      inputRange: [0, routes.length - 1],
      outputRange: [0, (dotSpacing + dotSize) * (routes.length - 1)],
      extrapolate: Extrapolate.CLAMP
    });
    const isLast = index === routes.length - 1;

    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          paddingVertical: 25,
          paddingHorizontal: 20,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row"
        }}>
        <LinearGradient
          style={{ ...StyleSheet.absoluteFill }}
          colors={["#0000", "#0004"]}
        />
        <View style={{ width: 36, height: 36 }} />
        <View
          style={{
            flexDirection: "row",
            minHeight: "auto",
            paddingVertical: dotSpacing,
            paddingHorizontal: dotSpacing / 2,
            flex: 0,
            zIndex: 0,
            alignItems: "center",
            justifyContent: "center"
          }}>
          {routes.map((route, index) => (
            <TouchableNativeFeedback
              key={route.key}
              onPress={() => jumpTo(index)}
              hitSlop={{
                left: dotSpacing / 2,
                right: dotSpacing / 2,
                top: 20,
                bottom: 10
              }}
              background={TouchableNativeFeedback.Ripple(
                "rgba(0,0,0,0.5)",
                true
              )}
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                marginHorizontal: dotSpacing / 2,
                backgroundColor: "rgba(255,255,255,0.5)"
              }}
            />
          ))}
          <Animated.View
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: "white",
              position: "absolute",
              left: dotSpacing,
              transform: [
                {
                  translateX
                }
              ]
            }}
          />
        </View>

        <TouchableNativeFeedback
          style={{
            width: 48,
            height: 48,
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center"
          }}
          background={TouchableNativeFeedback.Ripple(undefined, true)}
          onPress={() => {
            if (!isLast) jumpTo(index + 1);
            else onPressComplete();
          }}>
          {isLast ? (
            <Octicon name="check" color="rgba(0,0,0,0.8)" size={26} />
          ) : (
            <MaterialIcon
              name={"navigate-next"}
              size={36}
              color="rgba(0,0,0,0.8)"
            />
          )}
        </TouchableNativeFeedback>
      </View>
    );
  }
);

type ScreenTypeRequired = {|
  backgroundColor: string,
  title: string,
  description: string
|};

type ScreenType =
  | {|
      ...$Exact<ScreenTypeRequired>,
      animation: {}
    |}
  | {|
      ...$Exact<ScreenTypeRequired>,
      image: string
    |};

type Props = {
  screens?: ScreenType[],
  onPressComplete: () => any
};

const defaultScreens: ScreenType[] = [
  {
    backgroundColor: "#CFE0FC",
    title: "Map from anywhere",
    description: "Mark a place in the field, with or without the internet",
    animation: require("../../animations/world-locations.json")
  },
  {
    backgroundColor: "#EAFEE7",
    title: "Document with ease",
    description:
      "Create Observations of territories and monitored activities in a snap",
    animation: require("../../animations/location.json")
  },
  {
    backgroundColor: "#3C69F6",
    title: "Own your data",
    description:
      "Connect devices and easily control how you sync and share data",
    animation: require("../../animations/task-done.json")
  },
  {
    backgroundColor: "#EDEDED",
    title: "Create maps together",
    description:
      "Projects keep mapping and monitoring data organized and manageable",
    animation: require("../../animations/connect.json")
  }
];

export default function Pager({
  screens = defaultScreens,
  onPressComplete
}: Props) {
  const [index, setIndex] = React.useState(0);
  const [position] = useValues([0], []);
  const routes = React.useMemo(
    () => screens.map((screen, index) => ({ key: index })),
    [screens]
  );
  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setIndex(idx => {
          return Math.max(0, idx - 1);
        });
        return true;
      }
    );
    return () => subscription.remove();
  }, []);

  const renderScene = React.useCallback(
    ({ route, position }) => (
      <IntroScreen
        key={route.key}
        {...screens[route.key]}
        routes={routes}
        index={route.key}
        position={position}
      />
    ),
    [routes, screens]
  );

  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        tabBarPosition="bottom"
        renderTabBar={() => null}
        position={position}
      />
      <TabBar
        index={index}
        position={position}
        jumpTo={setIndex}
        onPressComplete={onPressComplete}
        routes={routes}
      />
    </>
  );
}
