package com.mapeo;

import android.os.Bundle; // react-native-splash-screen
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // react-native-splash-screen

/* Start: react-native-guesture-handler */
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
/* End: react-native-guesture-handler */

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // react-native-splash-screen
        super.onCreate(null); // react-native-screens
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "mapeo";
    }
}
