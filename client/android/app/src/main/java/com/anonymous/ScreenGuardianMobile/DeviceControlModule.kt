package com.anonymous.ScreenGuardianMobile

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

// Native module exposed to React Native.
// This module is the bridge between JavaScript/TypeScript and Android native code.
class DeviceControlModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    // This is the name that will appear inside NativeModules on the React Native side.
    override fun getName(): String = "DeviceControlModule"

    /**
     * Save the "lock now" flag locally on the device.
     * Called from React Native when we want to update the local policy state.
     */
    @ReactMethod
    fun setLockNow(value: Boolean) {
        PolicyStore.setLockNow(reactApplicationContext, value)
    }

    /**
     * Read the current "lock now" flag from local storage
     * and return it back to React Native.
     */
    @ReactMethod
    fun isLockNow(promise: Promise) {
        try {
            val locked = PolicyStore.isLockNow(reactApplicationContext)
            promise.resolve(locked)
        } catch (e: Exception) {
            promise.reject("LOCK_NOW_ERROR", e.message, e)
        }
    }
}