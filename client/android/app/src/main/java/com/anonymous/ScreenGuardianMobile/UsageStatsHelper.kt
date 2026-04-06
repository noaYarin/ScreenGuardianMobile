package com.screenguardianmobile

import android.app.usage.UsageStatsManager
import android.content.Context
import android.util.Log
import java.util.Calendar
import kotlin.math.min

object UsageStatsHelper {

    private const val TAG = "UsageStatsHelper"

    // Safety cap to prevent unrealistic values (e.g. overflow / bad OEM data)
    private const val MAX_MINUTES_PER_DAY = 24 * 60

    fun updateTodayUsage(context: Context) {
        try {
            val usageStatsManager =
                context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val startOfDay = getStartOfTodayInMillis()
            val now = System.currentTimeMillis()

            val stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startOfDay,
                now
            )

            var totalForegroundTimeMillis = 0L

            Log.d(TAG, "----- Usage refresh start -----")

            if (!stats.isNullOrEmpty()) {
                for (usage in stats) {
                    val packageName = usage.packageName ?: continue
                    val foregroundTime = usage.totalTimeInForeground

                    val excluded = shouldExcludePackage(context, packageName)

                    Log.d(
                        TAG,
                        "package=$packageName, foregroundMillis=$foregroundTime, excluded=$excluded"
                    )

                    if (excluded) continue
                    if (foregroundTime <= 0) continue

                    totalForegroundTimeMillis += foregroundTime
                }
            } else {
                Log.d(TAG, "queryUsageStats returned empty/null")
            }

            // Convert safely to minutes (stay in Long as long as possible)
            val usedMinutesRaw = totalForegroundTimeMillis / 1000L / 60L

            // Clamp to prevent overflow / unrealistic values
            val usedMinutesClamped = min(usedMinutesRaw, MAX_MINUTES_PER_DAY.toLong())

            val usedMinutes = usedMinutesClamped.toInt()

            PolicyStore.setUsedToday(context, usedMinutes)

            Log.d(
                TAG,
                "TOTAL foregroundMillis=$totalForegroundTimeMillis, usedMinutes=$usedMinutes"
            )
            Log.d(TAG, "----- Usage refresh end -----")

        } catch (e: Exception) {
            Log.e(TAG, "Failed to update today usage", e)
        }
    }

    private fun shouldExcludePackage(
        context: Context,
        packageName: String
    ): Boolean {

        // Exclude our own app
        if (packageName == context.packageName) return true

        // System UI & settings
        if (packageName == "com.android.settings") return true
        if (packageName == "com.android.systemui") return true

        // Permission controllers
        if (packageName == "com.google.android.permissioncontroller") return true
        if (packageName == "com.android.permissioncontroller") return true

        // Launchers / home screens
        if (packageName.startsWith("com.android.launcher")) return true
        if (packageName.startsWith("com.google.android.apps.nexuslauncher")) return true
        if (packageName.startsWith("com.sec.android.app.launcher")) return true
        if (packageName.startsWith("com.miui.home")) return true

        return false
    }

    fun hasUsageAccess(context: Context): Boolean {
        return try {
            val usageStatsManager =
                context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val now = System.currentTimeMillis()
            val stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                now - 60_000,
                now
            )

            !stats.isNullOrEmpty()
        } catch (e: Exception) {
            false
        }
    }

    private fun getStartOfTodayInMillis(): Long {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)
        return calendar.timeInMillis
    }
}