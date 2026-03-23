package com.screenguardianmobile

import android.app.usage.UsageStatsManager
import android.content.Context
import java.util.Calendar

// Reads today's usage time from Android UsageStatsManager
object UsageStatsHelper {

    // Update today's used minutes and save them into PolicyStore
    fun updateTodayUsage(context: Context) {
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

        if (stats != null) {
            for (usage in stats) {
                totalForegroundTimeMillis += usage.totalTimeInForeground
            }
        }

        val usedMinutes = (totalForegroundTimeMillis / 1000 / 60).toInt()
        PolicyStore.setUsedToday(context, usedMinutes)
    }

    // Check if the app has Usage Access permission
    fun hasUsageAccess(context: Context): Boolean {
        val usageStatsManager =
            context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

        val now = System.currentTimeMillis()
        val stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            now - 60_000,
            now
        )

        return stats != null && stats.isNotEmpty()
    }

    // Midnight of current day
    private fun getStartOfTodayInMillis(): Long {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)
        return calendar.timeInMillis
    }
}