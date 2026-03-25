package com.screenguardianmobile

import android.content.Context
import java.util.Calendar

object PolicyStore {

    private const val PREFS_NAME = "ScreenGuardianPolicy"

    private const val KEY_LOCK_NOW = "lockNow"
    private const val KEY_SERVER_LOCKED = "serverLocked"
    private const val KEY_LIMIT_ENABLED = "limitEnabled"
    private const val KEY_DAILY_LIMIT = "dailyLimit"
    private const val KEY_USED_TODAY = "usedToday"
    private const val KEY_EXTRA_MINUTES = "extraMinutes"
    private const val KEY_LAST_RESET = "lastReset"
    private const val KEY_BLOCK_REASON = "blockReason"

    private const val KEY_HEARTBEAT_BASE_URL = "heartbeatBaseUrl"
    private const val KEY_HEARTBEAT_DEVICE_ID = "heartbeatDeviceId"
    private const val KEY_HEARTBEAT_TOKEN = "heartbeatToken"

    private fun prefs(context: Context) =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun setLockNow(context: Context, value: Boolean) {
        prefs(context).edit().putBoolean(KEY_LOCK_NOW, value).apply()
    }

    fun isLockNow(context: Context): Boolean {
        return prefs(context).getBoolean(KEY_LOCK_NOW, false)
    }

    fun setServerLocked(context: Context, value: Boolean) {
        prefs(context).edit().putBoolean(KEY_SERVER_LOCKED, value).apply()
    }

    fun isServerLocked(context: Context): Boolean {
        return prefs(context).getBoolean(KEY_SERVER_LOCKED, false)
    }

    fun setLimitEnabled(context: Context, value: Boolean) {
        prefs(context).edit().putBoolean(KEY_LIMIT_ENABLED, value).apply()
    }

    fun isLimitEnabled(context: Context): Boolean {
        return prefs(context).getBoolean(KEY_LIMIT_ENABLED, false)
    }

    fun setDailyLimit(context: Context, minutes: Int) {
        prefs(context).edit().putInt(KEY_DAILY_LIMIT, minutes).apply()
    }

    fun getDailyLimit(context: Context): Int {
        return prefs(context).getInt(KEY_DAILY_LIMIT, 0)
    }

    fun setUsedToday(context: Context, minutes: Int) {
        prefs(context).edit().putInt(KEY_USED_TODAY, minutes).apply()
    }

    fun getUsedToday(context: Context): Int {
        resetIfNewDay(context)
        return prefs(context).getInt(KEY_USED_TODAY, 0)
    }

    fun setExtraMinutes(context: Context, minutes: Int) {
        prefs(context).edit().putInt(KEY_EXTRA_MINUTES, minutes).apply()
    }

    fun addExtraMinutes(context: Context, minutes: Int) {
        val currentExtraMinutes = getExtraMinutes(context)
        setExtraMinutes(context, currentExtraMinutes + minutes)
    }

    fun getExtraMinutes(context: Context): Int {
        resetIfNewDay(context)
        return prefs(context).getInt(KEY_EXTRA_MINUTES, 0)
    }

    fun setBlockReason(context: Context, reason: String) {
        prefs(context).edit().putString(KEY_BLOCK_REASON, reason).apply()
    }

    fun getBlockReason(context: Context): String {
        return prefs(context).getString(KEY_BLOCK_REASON, "") ?: ""
    }

    // ✅ תיקון חשוב: שימוש ב-Calendar ולא בחישוב נאיבי
    fun resetIfNewDay(context: Context) {
        val prefs = prefs(context)

        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)

        val todayStart = calendar.timeInMillis
        val lastReset = prefs.getLong(KEY_LAST_RESET, -1)

        if (lastReset != todayStart) {
            prefs.edit()
                .putLong(KEY_LAST_RESET, todayStart)
                .putInt(KEY_USED_TODAY, 0)
                .putInt(KEY_EXTRA_MINUTES, 0)
                .putString(KEY_BLOCK_REASON, "")
                .apply()
        }
    }

    fun getEffectiveLimit(context: Context): Int {
        resetIfNewDay(context)
        val dailyLimit = getDailyLimit(context)
        val extraMinutes = getExtraMinutes(context)
        return dailyLimit + extraMinutes
    }

    fun getRemainingMinutes(context: Context): Int {
        resetIfNewDay(context)

        if (!isLimitEnabled(context)) {
            return Int.MAX_VALUE
        }

        val effectiveLimit = getEffectiveLimit(context)
        val usedToday = getUsedToday(context)
        val remaining = effectiveLimit - usedToday

        return if (remaining > 0) remaining else 0
    }

    fun shouldLockDevice(context: Context): Boolean {
        if (isLockNow(context)) return true
        if (isServerLocked(context)) return true
        if (!isLimitEnabled(context)) return false
        return getRemainingMinutes(context) <= 0
    }

    fun setHeartbeatBaseUrl(context: Context, value: String) {
        prefs(context).edit().putString(KEY_HEARTBEAT_BASE_URL, value).apply()
    }

    fun getHeartbeatBaseUrl(context: Context): String? {
        return prefs(context).getString(KEY_HEARTBEAT_BASE_URL, null)
    }

    fun setHeartbeatDeviceId(context: Context, value: String) {
        prefs(context).edit().putString(KEY_HEARTBEAT_DEVICE_ID, value).apply()
    }

    fun getHeartbeatDeviceId(context: Context): String? {
        return prefs(context).getString(KEY_HEARTBEAT_DEVICE_ID, null)
    }

    fun setHeartbeatToken(context: Context, value: String) {
        prefs(context).edit().putString(KEY_HEARTBEAT_TOKEN, value).apply()
    }

    fun getHeartbeatToken(context: Context): String? {
        return prefs(context).getString(KEY_HEARTBEAT_TOKEN, null)
    }

    fun clearAll(context: Context) {
        prefs(context).edit().clear().apply()
    }
}