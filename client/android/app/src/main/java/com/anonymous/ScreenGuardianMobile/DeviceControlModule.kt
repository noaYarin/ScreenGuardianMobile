package com.screenguardianmobile

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeviceControlModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeviceControl"
    }

    @ReactMethod
    fun lockNow(promise: Promise) {
        try {
            PolicyStore.setLockNow(reactApplicationContext, true)
            PolicyStore.setBlockReason(reactApplicationContext, "LOCK_NOW")
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("LOCK_NOW_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun unlockNow(promise: Promise) {
        try {
            PolicyStore.setLockNow(reactApplicationContext, false)
            PolicyStore.setBlockReason(reactApplicationContext, "")
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("UNLOCK_NOW_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun setDailyLimit(minutes: Int, promise: Promise) {
        try {
            PolicyStore.setDailyLimit(reactApplicationContext, minutes)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SET_DAILY_LIMIT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun approveExtraMinutes(minutes: Int, promise: Promise) {
        try {
            PolicyStore.addExtraMinutes(reactApplicationContext, minutes)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("APPROVE_EXTRA_MINUTES_ERROR", e.message, e)
        }
    }


    @ReactMethod
    fun saveHeartbeatConfig(baseUrl: String, deviceId: String, childToken: String, promise: Promise) {
        try {
            PolicyStore.setHeartbeatBaseUrl(reactApplicationContext, baseUrl)
            PolicyStore.setHeartbeatDeviceId(reactApplicationContext, deviceId)
            PolicyStore.setHeartbeatToken(reactApplicationContext, childToken)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SAVE_HEARTBEAT_CONFIG_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun syncPolicyNow(promise: Promise) {
        try {
            DevicePolicySyncHelper.fetchAndSavePolicy(reactApplicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SYNC_POLICY_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getRemainingTime(promise: Promise) {
        try {
            UsageStatsHelper.updateTodayUsage(reactApplicationContext)

            val result = Arguments.createMap().apply {
                putInt("dailyLimitMinutes", PolicyStore.getDailyLimit(reactApplicationContext))
                putInt("usedTodayMinutes", PolicyStore.getUsedToday(reactApplicationContext))
                putInt("extraMinutes", PolicyStore.getExtraMinutes(reactApplicationContext))
                putInt("remainingMinutes", PolicyStore.getRemainingMinutes(reactApplicationContext))
                putBoolean("lockNow", PolicyStore.isLockNow(reactApplicationContext))
                putBoolean("shouldLock", PolicyStore.shouldLockDevice(reactApplicationContext))
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("GET_REMAINING_TIME_ERROR", e.message, e)
        }
    }
}