package com.mapeo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.bugsnag.BugsnagReactNative;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.rnfs.RNFSPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.janeasystems.rn_nodejs_mobile.RNNodeJsMobilePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.mapeo.generated.BasePackageList;
import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.SingletonModule;

import com.mapbox.rctmgl.RCTMGLPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ShareApplication, ReactApplication {
  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(
    new BasePackageList().getPackageList(),
    Arrays.<SingletonModule>asList()
  );

  @Override
  public String getFileProviderAuthority() {
      return BuildConfig.APPLICATION_ID + ".provider";
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            BugsnagReactNative.getPackage(),
            new RNSharePackage(),
            new KCKeepAwakePackage(),
            new AndroidOpenSettingsPackage(),
            new RNNetworkInfoPackage(),
            new NetInfoPackage(),
            new AsyncStoragePackage(),
            new LinearGradientPackage(),
            new ImageResizerPackage(),
            new RNScreensPackage(),
            new RNFSPackage(),
            new ReanimatedPackage(),
          new RNGestureHandlerPackage(),
          new SplashScreenReactPackage(),
          new RNNodeJsMobilePackage(),
          new RCTMGLPackage(),
          new ModuleRegistryAdapter(mModuleRegistryProvider)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return BuildConfig.isStorybook ? "storybook-native/index" : "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    BugsnagReactNative.start(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
