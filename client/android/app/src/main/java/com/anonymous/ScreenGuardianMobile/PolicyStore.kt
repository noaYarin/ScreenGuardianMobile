package com.screenguardianmobile

import android.content.Context

// Stores the local device policy so restrictions can still work offline.
object PolicyStore {

    // SharedPreferences file name
    private const val PREFS_NAME = "ScreenGuardianPolicy"

    // Keys
    private const val KEY_LOCK_NOW = "lockNow"
    private const val KEY_DAILY_LIMIT = "dailyLimit"
    private const val KEY_USED_TODAY = "usedToday"
    private const val KEY_EXTRA_MINUTES = "extraMinutes"
    private const val KEY_LAST_RESET = "lastReset"

    // Save immediate lock state
    fun setLockNow(context: Context, value: Boolean) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putBoolean(KEY_LOCK_NOW, value).apply()
    }

    // Read immediate lock state
    fun isLockNow(context: Context): Boolean {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getBoolean(KEY_LOCK_NOW, false)
    }

    // Save daily screen-time limit in minutes
    fun setDailyLimit(context: Context, minutes: Int) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putInt(KEY_DAILY_LIMIT, minutes).apply()
    }

    // Read daily screen-time limit
    fun getDailyLimit(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_DAILY_LIMIT, 0)
    }

    // Save today's used minutes
    fun setUsedToday(context: Context, minutes: Int) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putInt(KEY_USED_TODAY, minutes).apply()
    }

    // Read today's used minutes
    fun getUsedToday(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_USED_TODAY, 0)
    }

    // Add approved extra minutes for today
    fun addExtraMinutes(context: Context, minutes: Int) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val currentExtraMinutes = prefs.getInt(KEY_EXTRA_MINUTES, 0)

        prefs.edit()
            .putInt(KEY_EXTRA_MINUTES, currentExtraMinutes + minutes)
            .apply()
    }

    // Read approved extra minutes for today
    fun getExtraMinutes(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_EXTRA_MINUTES, 0)
    }

    // Reset daily values if a new day has started
    fun resetIfNewDay(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        val today = System.currentTimeMillis() / (1000 * 60 * 60 * 24)
        val lastReset = prefs.getLong(KEY_LAST_RESET, -1)

        if (lastReset != today) {
            prefs.edit()
                .putLong(KEY_LAST_RESET, today)
                .putInt(KEY_USED_TODAY, 0)
                .putInt(KEY_EXTRA_MINUTES, 0)
                .apply()
        }
    }

    // Daily limit + approved extra minutes
    fun getEffectiveLimit(context: Context): Int {
        resetIfNewDay(context)
        val dailyLimit = getDailyLimit(context)
        val extraMinutes = getExtraMinutes(context)
        return dailyLimit + extraMinutes
    }

    // Remaining minutes for today
    fun getRemainingMinutes(context: Context): Int {
        resetIfNewDay(context)

        val effectiveLimit = getEffectiveLimit(context)
        val usedToday = getUsedToday(context)
        val remaining = effectiveLimit - usedToday

        return if (remaining > 0) remaining else 0
    }

    // Lock rules:
    // 1. lockNow always wins
    // 2. if remaining time is 0 -> lock
    fun shouldLockDevice(context: Context): Boolean {
        if (isLockNow(context)) {
            return true
        }

        return getRemainingMinutes(context) <= 0
    }

    // Clear everything (useful for testing)
    fun clearAll(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().clear().apply()
    }
}