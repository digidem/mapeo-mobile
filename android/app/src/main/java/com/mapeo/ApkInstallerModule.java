package com.mapeo;

import android.content.Intent;
import android.app.Activity;
import android.net.Uri;
import android.os.Build;
import androidx.core.content.FileProvider;

import android.util.Base64;
import android.util.Log;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

// Largely borrowed from https://github.com/nodece/react-native-apk-installer-n
// Added ability to return promise if install cancelled as described in
// https://facebook.github.io/react-native/docs/native-modules-android#getting-activity-result-from-startactivityforresult
public class ApkInstallerModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private static final int INSTALL_REQUEST = 3033;
  private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
  private static final String E_INSTALL_CANCELLED = "E_INSTALL_CANCELLED";
  private static final String E_INSTALL_FAILED = "E_INSTALL_FAILED";

  private Promise mPickerPromise;

  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
      if (requestCode == INSTALL_REQUEST) {
        if (mPickerPromise != null) {
          if (resultCode == Activity.RESULT_CANCELED) {
            mPickerPromise.reject(E_INSTALL_CANCELLED, "Install was cancelled");
          } else if (resultCode == Activity.RESULT_OK) {
            mPickerPromise.resolve(null);
          } else {
            mPickerPromise.reject(E_INSTALL_FAILED, "Install failed");
          }
          mPickerPromise = null;
        }
      }
    }
  };

  public ApkInstallerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    // Register this native module as Activity result listener
    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @Override
  public String getName() {
    return "ApkInstaller";
  }

  private void getSignatures(PackageInfo pi) {
    MessageDigest md;
    try {
      md = MessageDigest.getInstance("SHA");
      for (Signature signature : pi.signatures) {
        md.update(signature.toByteArray());
        final String hashedSignature = new String(Base64.encode(md.digest(), Base64.DEFAULT));
        Log.w("ReactNative", hashedSignature);
      }

      Log.w("ReactNative", pi.packageName);

    } catch(NoSuchAlgorithmException x) {
      Log.w("ReactNative", "no such alg");
    }
  }

  @ReactMethod
  public void install(String filePath, final Promise promise) {
    Activity currentActivity = getCurrentActivity();

    if (currentActivity == null) {
      promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
      return;
    }

    // Store the promise to resolve/reject when installer activity completes
    mPickerPromise = promise;

    try {
      getSignatures(reactContext.getPackageManager().getPackageArchiveInfo(filePath, PackageManager.GET_SIGNATURES));
      getSignatures(reactContext.getPackageManager().getPackageInfo(reactContext.getPackageName(), PackageManager.GET_SIGNATURES));
    } catch (PackageManager.NameNotFoundException e) {}

    Intent intent = new Intent();
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    intent.setAction(Intent.ACTION_VIEW);
    File apkFile = new File(filePath);
    Uri apkUri;

    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        String authority = reactContext.getPackageName() + ".provider";
        apkUri = FileProvider.getUriForFile(reactContext, authority, apkFile);
      } else {
        apkUri = Uri.fromFile(apkFile);
      }
      // This does not actually do anything - it should allow installs without
      // "unknown sources" checked, but apparently it only works for system apps
      // installed by an OEM https://issuetracker.google.com/issues/36963283
      intent.putExtra(Intent.EXTRA_NOT_UNKNOWN_SOURCE, true);
      intent.putExtra(Intent.EXTRA_RETURN_RESULT, true);
      intent.putExtra(Intent.EXTRA_INSTALLER_PACKAGE_NAME, reactContext.getPackageName());
      intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
      currentActivity.startActivityForResult(intent, INSTALL_REQUEST);
    } catch (Exception e) {
      mPickerPromise.reject(e);
      mPickerPromise = null;
    }
  }
}
