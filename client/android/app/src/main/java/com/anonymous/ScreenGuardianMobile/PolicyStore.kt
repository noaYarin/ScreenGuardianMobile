package com.anonymous.ScreenGuardianMobile

import android.content.Context

// Singleton object responsible for storing local policy on the device
// This allows enforcing restrictions even when the device is offline
object PolicyStore {

    // Name of the SharedPreferences file (local storage)
    private const val PREFS_NAME = "ScreenGuardianPolicy"

    // Key used to store the "lock now" state
    private const val KEY_LOCK_NOW = "lockNow"

    /**
     * Saves the "lock now" state locally on the device
     * @param context - Android context used to access system services
     * @param value - true = device should be locked, false = unlocked
     */
    fun setLockNow(context: Context, value: Boolean) {

        // Access local storage (SharedPreferences)
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        // Save the value (lockNow = true/false)
        prefs.edit()
            .putBoolean(KEY_LOCK_NOW, value)
            .apply() // apply() saves asynchronously (better performance)
    }

    /**
     * Retrieves the current "lock now" state from local storage
     * @param context - Android context
     * @return true if device should be locked, false otherwise
     */
    fun isLockNow(context: Context): Boolean {

        // Access the same SharedPreferences storage
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        // Return stored value, default = false if not found
        return prefs.getBoolean(KEY_LOCK_NOW, false)
    }
}