package com.mapeo;

import android.content.Intent;
import android.content.ActivityNotFoundException;
import android.app.Activity;
import android.net.Uri;
import android.os.Build;
import androidx.core.content.FileProvider;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

// Largely borrowed from https://github.com/nodece/react-native-apk-installer-n
// Added ability to return promise if install cancelled as described in
// https://facebook.github.io/react-native/docs/native-modules-android#getting-activity-result-from-startactivityforresult
public class ApkInstallerModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private static final String TAG = "ApkInstaller";
  private static final int INSTALL_REQUEST = 3033;
  private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
  private static final String E_FILE_DOES_NOT_EXIST = "E_FILE_DOES_NOT_EXIST";
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
            Log.e(TAG, "Install failed, result code: " + resultCode);
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

  @ReactMethod
  public void install(String filePath, final Promise promise) {
    Activity currentActivity = getCurrentActivity();

    if (currentActivity == null) {
      promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
      return;
    }

    File apkFile = new File(filePath);
    if (!apkFile.exists()) {
        Log.e(TAG, "installApk: file does not exist '" + filePath + "'");
        promise.reject(E_FILE_DOES_NOT_EXIST, "Apk file does not exist");
        return;
    }

    // Store the promise to resolve/reject when installer activity completes
    mPickerPromise = promise;

    Intent intent = new Intent();

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      // API24 and up has a package installer that can handle FileProvider content:// URIs
      String authority = reactContext.getPackageName() + ".provider";
      Uri apkUri;
      try {
        apkUri = FileProvider.getUriForFile(getReactApplicationContext(), authority, apkFile);
      } catch (Exception e) {
        Log.e(TAG, "installApk exception with authority name '" + authority + "'", e);
        mPickerPromise.reject(e);
        mPickerPromise = null;
        return;
      }
      intent.setAction(Intent.ACTION_INSTALL_PACKAGE);
      intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
      intent.putExtra(Intent.EXTRA_RETURN_RESULT, true);
      intent.putExtra(Intent.EXTRA_INSTALLER_PACKAGE_NAME, reactContext.getPackageName());
    } else {
      // Old APIs do not handle content:// URIs, so use an old file:// style
      // The apk file and any parent folders need to be world-accessible for the
      // package installer to be able to access them.
      apkFile.setReadable(true, false);
      // WARNING: This assumes that this is in a folder one-level deep within
      // the internal storage files dir (getFilesDir()).
      apkFile.getParentFile().setExecutable(true, false);
      Uri apkUri = Uri.fromFile(apkFile);
      intent.setAction(Intent.ACTION_INSTALL_PACKAGE);
      intent.setData(apkUri);
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      intent.putExtra(Intent.EXTRA_RETURN_RESULT, true);
    }
    try {
      currentActivity.startActivityForResult(intent, INSTALL_REQUEST);
    } catch (ActivityNotFoundException e) {
      Log.e(TAG, "ActivityNotFoundException", e);
      mPickerPromise.reject(e);
      mPickerPromise = null;
    }
  }
}
