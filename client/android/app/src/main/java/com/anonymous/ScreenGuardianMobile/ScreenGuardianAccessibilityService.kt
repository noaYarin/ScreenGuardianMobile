package com.anonymous.ScreenGuardianMobile

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.util.Log
import android.view.accessibility.AccessibilityEvent

class ScreenGuardianAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "ScreenGuardianService"
    }

override fun onServiceConnected() {
    super.onServiceConnected()
    PolicyStore.setLockNow(applicationContext, true)
    Log.d(TAG, "Accessibility service connected")
}
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        // We only care about app/window changes
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            return
        }

        val currentPackage = event.packageName?.toString() ?: "unknown"
        val isLocked = PolicyStore.isLockNow(applicationContext)

        Log.d(TAG, "Window changed. Current package: $currentPackage")
        Log.d(TAG, "Current lockNow value: $isLocked")

        // If the device is not locked, do nothing
        if (!isLocked) return

        // Prevent reopening the block screen when our own app is already on screen
        if (currentPackage == packageName) {
            return
        }

        Log.d(TAG, "Opening block screen")

        val intent = Intent(this, BlockScreenActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }

        startActivity(intent)
    }

    override fun onInterrupt() {
        Log.d(TAG, "Accessibility service interrupted")
    }
}