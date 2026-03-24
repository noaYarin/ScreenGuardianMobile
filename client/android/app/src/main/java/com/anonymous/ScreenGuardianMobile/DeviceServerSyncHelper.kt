package com.screenguardianmobile

import android.content.Context
import android.util.Log
import java.net.HttpURLConnection
import java.net.URL

object DeviceServerSyncHelper {

    private const val TAG = "DeviceServerSync"

    fun sendHeartbeat(context: Context) {
        try {
            val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
            val deviceId = PolicyStore.getHeartbeatDeviceId(context) ?: return
            val token = PolicyStore.getHeartbeatToken(context) ?: return
            val usageAccessEnabled = UsageStatsHelper.hasUsageAccess(context)

            Thread {
                try {
                    val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/heartbeat")
                    val connection = url.openConnection() as HttpURLConnection

                    connection.requestMethod = "PATCH"
                    connection.setRequestProperty("Content-Type", "application/json")
                    connection.setRequestProperty("Authorization", "Bearer $token")
                    connection.doOutput = true
                    connection.connectTimeout = 10000
                    connection.readTimeout = 10000

                    val body = """
                    {
                      "accessibilityEnabled": true,
                      "usageAccessEnabled": $usageAccessEnabled
                    }
                    """.trimIndent()

                    connection.outputStream.use { os ->
                        os.write(body.toByteArray(Charsets.UTF_8))
                    }

                    val responseCode = connection.responseCode
                    Log.d(TAG, "Heartbeat sent. responseCode=$responseCode")

                    connection.disconnect()
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to send heartbeat", e)
                }
            }.start()
        } catch (e: Exception) {
            Log.e(TAG, "Heartbeat error", e)
        }
    }

    fun sendUsage(context: Context) {
        try {
            val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
            val deviceId = PolicyStore.getHeartbeatDeviceId(context) ?: return
            val token = PolicyStore.getHeartbeatToken(context) ?: return
            val usedTodayMinutes = PolicyStore.getUsedToday(context)

            Thread {
                try {
                    val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/usage")
                    val connection = url.openConnection() as HttpURLConnection

                    connection.requestMethod = "PATCH"
                    connection.setRequestProperty("Content-Type", "application/json")
                    connection.setRequestProperty("Authorization", "Bearer $token")
                    connection.doOutput = true
                    connection.connectTimeout = 10000
                    connection.readTimeout = 10000

                    val body = """
                    {
                      "usedTodayMinutes": $usedTodayMinutes
                    }
                    """.trimIndent()

                    connection.outputStream.use { os ->
                        os.write(body.toByteArray(Charsets.UTF_8))
                    }

                    val responseCode = connection.responseCode
                    Log.d(TAG, "Usage sent. responseCode=$responseCode, usedTodayMinutes=$usedTodayMinutes")

                    connection.disconnect()
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to send usage", e)
                }
            }.start()
        } catch (e: Exception) {
            Log.e(TAG, "Usage error", e)
        }
    }
}