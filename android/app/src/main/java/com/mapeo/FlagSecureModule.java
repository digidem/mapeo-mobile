// Based off https://github.com/kristiansorens/react-native-flag-secure-android 
package com.mapeo;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.app.Activity;
import android.view.WindowManager;

public class FlagSecureModule extends ReactContextBaseJavaModule {
    FlagSecureModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "FlagSecureModule";
    }

    @ReactMethod
    public void activate() {
        final Activity activity = getCurrentActivity();

        if (activity != null) {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() 
                {
                    activity.getWindow().setFlags(
                        WindowManager.LayoutParams.FLAG_SECURE,
                        WindowManager.LayoutParams.FLAG_SECURE
                    );
                }
            });
        }

        
    }
    
    @ReactMethod
    public void deactivate() {
        final Activity activity = getCurrentActivity();
        
        if (activity != null) {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
                }
            });
        }
    }
}
