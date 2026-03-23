package com.screenguardianmobile

import android.content.Context

object PolicyStore {

    private const val PREFS_NAME = "ScreenGuardianPolicy"

    private const val KEY_LOCK_NOW = "lockNow"
    private const val KEY_DAILY_LIMIT = "dailyLimit"
    private const val KEY_USED_TODAY = "usedToday"
    private const val KEY_EXTRA_MINUTES = "extraMinutes"
    private const val KEY_LAST_RESET = "lastReset"
    private const val KEY_BLOCK_REASON = "blockReason"

    fun setLockNow(context: Context, value: Boolean) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putBoolean(KEY_LOCK_NOW, value).apply()
    }

    fun isLockNow(context: Context): Boolean {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getBoolean(KEY_LOCK_NOW, false)
    }

    fun setDailyLimit(context: Context, minutes: Int) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putInt(KEY_DAILY_LIMIT, minutes).apply()
    }

    fun getDailyLimit(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_DAILY_LIMIT, 0)
    }

    fun setUsedToday(context: Context, minutes: Int) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putInt(KEY_USED_TODAY, minutes).apply()
    }

    fun getUsedToday(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_USED_TODAY, 0)
    }

    fun addExtraMinutes(context: Context, minutes: Int) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val currentExtraMinutes = prefs.getInt(KEY_EXTRA_MINUTES, 0)

        prefs.edit()
            .putInt(KEY_EXTRA_MINUTES, currentExtraMinutes + minutes)
            .apply()
    }

    fun getExtraMinutes(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_EXTRA_MINUTES, 0)
    }

    fun setBlockReason(context: Context, reason: String) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putString(KEY_BLOCK_REASON, reason).apply()
    }

    fun getBlockReason(context: Context): String {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getString(KEY_BLOCK_REASON, "") ?: ""
    }

    fun resetIfNewDay(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        val today = System.currentTimeMillis() / (1000 * 60 * 60 * 24)
        val lastReset = prefs.getLong(KEY_LAST_RESET, -1)

        if (lastReset != today) {
            prefs.edit()
                .putLong(KEY_LAST_RESET, today)
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

        val effectiveLimit = getEffectiveLimit(context)
        val usedToday = getUsedToday(context)
        val remaining = effectiveLimit - usedToday

        return if (remaining > 0) remaining else 0
    }

    fun shouldLockDevice(context: Context): Boolean {
        if (isLockNow(context)) {
            return true
        }

        return getRemainingMinutes(context) <= 0
    }

    fun clearAll(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().clear().apply()
    }
}