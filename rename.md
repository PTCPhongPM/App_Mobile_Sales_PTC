
1. `android/app/src/main/AndroidManifest.xml`

```
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.ansuzdev.autosale">
```

2. `android/app/BUCK`

```
android_build_config(
    name = "build_config",
    package = "com.ansuzdev.autosale",
)

android_resource(
    name = "res",
    package = "com.ansuzdev.autosale",
    res = "src/main/res",
)
```

3. `android/app/src/main/java/`

```
package com.ansuzdev.autosale;

@Override
protected String getMainComponentName() {
  return "autosale";
}
```

4. `android/app/build.gradle`

```
    defaultConfig {
        applicationId "com.ansuzdev.autosale"
```

5. `android/app/src/main/java/com/ansuzdev/autosale`

```
package com.ansuzdev.autosale;

import com.ansuzdev.autosale.newarchitecture.MainApplicationReactNativeHost;
```

6. `app.json`

```
{
  "name": "autosale",
  "displayName": "Autosale"
}
```

7. `android/settings.gradle`

```
rootProject.name = 'autosale'
```

8. `android/app/src/main/res/values/strings.xml`

```
<resources>
    <string name="app_name">Autosale</string>
</resources>
```

9. `android/app/src/debug/java/com/ansuzdev/autosale/ReactNativeFlipper.java`

```
package com.ansuzdev.autosale;
```

10. `android/app/src/main/java/com/ansuzdev/autosale/MainApplication.java`

```
  Class.forName("com.ansuzdev.autosale.ReactNativeFlipper");
```

11. `android/app/src/main/java/com/ansuzdev/autosale/../MainApplicationReactNativeHost.java`

```
package com.ansuzdev.autosale.newarchitecture;

import com.ansuzdev.autosale.BuildConfig;
import com.ansuzdev.autosale.newarchitecture.components.MainComponentsRegistry;
import com.ansuzdev.autosale.newarchitecture.modules.MainApplicationTurboModuleManagerDelegate;
```

12. `android/app/src/main/java/com/ansuzdev/autosale/../MainComponentsRegistry.java`

```
package com.ansuzdev.autosale.newarchitecture.components;
```

13. `android/app/src/main/java/com/ansuzdev/autosale/../MainApplicationTurboModuleManagerDelegate.java`

```
package com.ansuzdev.autosale.newarchitecture.modules;
```

14. `android/app/src/main/java/com/ansuzdev/autosale/../MainApplicationTurboModuleManagerDelegate.java`

```
SoLoader.loadLibrary("autosale_appmodules");
sIsSoLibraryLoaded = true;
```

15. `android/app/src/main/jni/Android.mk`

```
LOCAL_MODULE := autosale_appmodules
```

16. `android/app/src/main/jni/MainApplicationTurboModuleManagerDelegate.h`

```
static constexpr auto kJavaDescriptor =
      "Lcom/ansuzdev/autosale/newarchitecture/modules/MainApplicationTurboModuleManagerDelegate;";

```

17. `android/app/src/main/jni/MainComponentsRegistry.h`

```
constexpr static auto kJavaDescriptor =
      "Lcom/ansuzdev/autosale/newarchitecture/components/MainComponentsRegistry;";
```
