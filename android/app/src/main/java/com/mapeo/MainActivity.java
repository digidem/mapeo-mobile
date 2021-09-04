package com.mapeo;

import android.os.Bundle; // react-native-splash-screen
import org.devio.rn.splashscreen.SplashScreen; // react-native-splash-screen

/* Start: expo-dev-client */
import android.content.Intent;
import expo.modules.devlauncher.DevLauncherController;
import expo.modules.devmenu.react.DevMenuAwareReactActivity;
/* End: expo-dev-client */

/* Start: react-native-gesture-handler */
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
/* End: react-native-gesture-handler */

public class MainActivity extends DevMenuAwareReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // react-native-splash-screen
        super.onCreate(savedInstanceState);
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        ReactActivityDelegate delegate = new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
        return DevLauncherController.wrapReactActivityDelegate(this,()-> delegate);
    }

    @Override
    public void onNewIntent(Intent intent) {
        if (DevLauncherController.tryToHandleIntent(this, intent)) {
           return;
        }
        super.onNewIntent(intent);
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
