package com.screenguardianmobile

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

// This class registers our native module so React Native can use it
class DeviceControlPackage : ReactPackage {

    // Register native modules (non-UI logic)
    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): List<NativeModule> {

        return listOf(
            DeviceControlModule(reactContext) // our module
        )
    }

    // We are not creating any custom native UI components
    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): List<ViewManager<*, *>> {
        return emptyList()
    }
}