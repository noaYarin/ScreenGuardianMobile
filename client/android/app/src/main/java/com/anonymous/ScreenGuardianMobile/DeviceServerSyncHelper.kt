package com.screenguardianmobile

import android.content.Context
import android.util.Log
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.min

object DeviceServerSyncHelper {

    private const val TAG = "DeviceServerSync"

    private const val MAX_MINUTES_PER_DAY = 24 * 60

    fun sendHeartbeat(context: Context) {
        try {
            val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
            val deviceId = PolicyStore.getHeartbeatDeviceId(context) ?: return
            val token = PolicyStore.getHeartbeatToken(context) ?: return
            val usageAccessEnabled = UsageStatsHelper.hasUsageAccess(context)

            Thread {
                var connection: HttpURLConnection? = null

                try {
                    val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/heartbeat")
                    connection = url.openConnection() as HttpURLConnection

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

                    connection.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }

                    val responseCode = connection.responseCode
                    val responseBody = readResponse(connection)

                    Log.d(TAG, "Heartbeat responseCode=$responseCode body=$responseBody")

                } catch (e: Exception) {
                    Log.e(TAG, "Failed to send heartbeat", e)
                } finally {
                    connection?.disconnect()
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

            val usedTodayMinutesRaw = PolicyStore.getUsedToday(context)

            // Clamp to prevent invalid values
            val usedTodayMinutes = min(usedTodayMinutesRaw, MAX_MINUTES_PER_DAY)

            Thread {
                var connection: HttpURLConnection? = null

                try {
                    val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/usage")
                    connection = url.openConnection() as HttpURLConnection

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

                    connection.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }

                    val responseCode = connection.responseCode
                    val responseBody = readResponse(connection)

                    Log.d(
                        TAG,
                        "Usage responseCode=$responseCode used=$usedTodayMinutes body=$responseBody"
                    )

                } catch (e: Exception) {
                    Log.e(TAG, "Failed to send usage", e)
                } finally {
                    connection?.disconnect()
                }
            }.start()

        } catch (e: Exception) {
            Log.e(TAG, "Usage error", e)
        }
    }

    // Read response safely (handles both success and error streams)
    private fun readResponse(connection: HttpURLConnection): String {
        return try {
            val stream = if (connection.responseCode in 200..299) {
                connection.inputStream
            } else {
                connection.errorStream
            }

            stream?.let {
                BufferedReader(InputStreamReader(it)).use { reader ->
                    reader.readText()
                }
            } ?: ""
        } catch (e: Exception) {
            "Failed to read response"
        }
    }
}