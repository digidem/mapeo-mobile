package com.mapeomobile;

import android.app.Application;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import io.fabric.sdk.android.Fabric;
import org.reactnative.camera.RNCameraPackage;
import com.staltz.reactnativenode.RNNodePackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SvgPackage(),
            new VectorIconsPackage(),
            new RNI18nPackage(),
          new RNCameraPackage(),
          new RNNodePackage(),
          new RCTMGLPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return BuildConfig.FLAVOR == "benchmark" ? "benchmark/index" : "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
