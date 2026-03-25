package com.screenguardianmobile

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.accessibility.AccessibilityEvent

class ScreenGuardianAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "ScreenGuardianService"
        private const val CHECK_INTERVAL_MS = 5000L
    }

    private val handler = Handler(Looper.getMainLooper())

    private val allowedPackages = setOf(
        "com.screenguardianmobile",
        "com.google.android.dialer",
        "com.samsung.android.dialer",
        "com.android.dialer",
        "com.android.server.telecom",
        "com.android.incallui"
    )

    private val lockChecker = object : Runnable {
        override fun run() {
            try {
                DevicePolicySyncHelper.fetchAndSavePolicy(applicationContext) {
                    try {
                        UsageStatsHelper.updateTodayUsage(applicationContext)
                        checkAndLockIfNeeded(null)
                        DeviceServerSyncHelper.sendUsage(applicationContext)
                        DeviceServerSyncHelper.sendHeartbeat(applicationContext)
                    } catch (e: Exception) {
                        Log.e(TAG, "Error after policy sync", e)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error while checking lock state", e)
            }

            handler.postDelayed(this, CHECK_INTERVAL_MS)
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "Accessibility service connected")
        handler.post(lockChecker)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val currentPackage = event.packageName?.toString()
        Log.d(TAG, "Window changed. Current package: $currentPackage")

        try {
            DevicePolicySyncHelper.fetchAndSavePolicy(applicationContext) {
                try {
                    UsageStatsHelper.updateTodayUsage(applicationContext)
                    checkAndLockIfNeeded(currentPackage)
                } catch (e: Exception) {
                    Log.e(TAG, "Error after policy+usage refresh", e)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to refresh policy/usage before lock check", e)
        }
    }

    override fun onInterrupt() {
        Log.d(TAG, "Accessibility service interrupted")
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(lockChecker)
    }

    private fun checkAndLockIfNeeded(currentPackage: String?) {
        val usedToday = PolicyStore.getUsedToday(applicationContext)
        val remaining = PolicyStore.getRemainingMinutes(applicationContext)
        val isLockNow = PolicyStore.isLockNow(applicationContext)
        val isServerLocked = PolicyStore.isServerLocked(applicationContext)
        val isLimitEnabled = PolicyStore.isLimitEnabled(applicationContext)
        val dailyLimit = PolicyStore.getDailyLimit(applicationContext)
        val extraMinutes = PolicyStore.getExtraMinutes(applicationContext)

        if (isLockNow || isServerLocked) {
            PolicyStore.setBlockReason(applicationContext, "LOCK_NOW")
        } else if (isLimitEnabled && remaining <= 0) {
            PolicyStore.setBlockReason(applicationContext, "DAILY_LIMIT_REACHED")
        } else {
            PolicyStore.setBlockReason(applicationContext, "")
        }

        val shouldLock = PolicyStore.shouldLockDevice(applicationContext)
        val blockReason = PolicyStore.getBlockReason(applicationContext)

        Log.d(
            TAG,
            "usedToday=$usedToday, remaining=$remaining, dailyLimit=$dailyLimit, extraMinutes=$extraMinutes, isLimitEnabled=$isLimitEnabled, isLockNow=$isLockNow, isServerLocked=$isServerLocked, shouldLock=$shouldLock, blockReason=$blockReason, currentPackage=$currentPackage"
        )

        if (!shouldLock) return

        if (currentPackage != null && isPackageAllowed(currentPackage)) {
            Log.d(TAG, "Allowed package during block: $currentPackage")
            return
        }

        if (BlockScreenActivity.isOpen) {
            Log.d(TAG, "Block screen already open")
            return
        }

        val intent = Intent(this, BlockScreenActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra("blockReason", blockReason)
            putExtra("usedTodayMinutes", usedToday)
            putExtra("dailyLimitMinutes", dailyLimit)
            putExtra("extraMinutes", extraMinutes)
        }

        Log.d(TAG, "Opening BlockScreenActivity")
        startActivity(intent)
    }

    private fun isPackageAllowed(packageName: String): Boolean {
        return allowedPackages.contains(packageName)
    }
}