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
        private const val CHECK_INTERVAL_MS = 15000L
    }

    private val handler = Handler(Looper.getMainLooper())

    private val allowedPackages = setOf(
        "com.screenguardianmobile",
        "com.android.settings",
        "host.exp.exponent"
    )

    private val allowedPackagePrefixes = listOf(
        "com.android.launcher",
        "com.google.android.apps.nexuslauncher",
        "com.sec.android.app.launcher",
        "com.miui.home"
    )

    private val lockChecker = object : Runnable {
        override fun run() {
            try {
                DevicePolicySyncHelper.fetchAndSavePolicy(applicationContext)
                UsageStatsHelper.updateTodayUsage(applicationContext)
                checkAndLockIfNeeded(null)
                DeviceServerSyncHelper.sendUsage(applicationContext)
                DeviceServerSyncHelper.sendHeartbeat(applicationContext)
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

        checkAndLockIfNeeded(currentPackage)
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
        val shouldLock = PolicyStore.shouldLockDevice(applicationContext)
        val isLockNow = PolicyStore.isLockNow(applicationContext)
        val isServerLocked = PolicyStore.isServerLocked(applicationContext)

        if (isLockNow || isServerLocked) {
            PolicyStore.setBlockReason(applicationContext, "LOCK_NOW")
        } else if (PolicyStore.isLimitEnabled(applicationContext) && remaining <= 0) {
            PolicyStore.setBlockReason(applicationContext, "DAILY_LIMIT_REACHED")
        } else {
            PolicyStore.setBlockReason(applicationContext, "")
        }

        val blockReason = PolicyStore.getBlockReason(applicationContext)

        Log.d(TAG, "Used today: $usedToday minutes")
        Log.d(TAG, "Remaining: $remaining minutes")
        Log.d(TAG, "Should lock device: $shouldLock")
        Log.d(TAG, "Block reason: $blockReason")

        if (!shouldLock) return
        if (BlockScreenActivity.isOpen) return

        if (currentPackage != null && isPackageAllowed(currentPackage)) {
            Log.d(TAG, "Skipping block for allowed package: $currentPackage")
            return
        }

        val dailyLimit = PolicyStore.getDailyLimit(applicationContext)
        val extraMinutes = PolicyStore.getExtraMinutes(applicationContext)

        val intent = Intent(this, BlockScreenActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra("blockReason", blockReason)
            putExtra("usedTodayMinutes", usedToday)
            putExtra("dailyLimitMinutes", dailyLimit)
            putExtra("extraMinutes", extraMinutes)
        }

        startActivity(intent)
    }

    private fun isPackageAllowed(packageName: String): Boolean {
        if (allowedPackages.contains(packageName)) return true
        return allowedPackagePrefixes.any { packageName.startsWith(it) }
    }
}