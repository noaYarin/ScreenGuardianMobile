package com.screenguardianmobile

import android.content.Context
import android.util.Log
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

object DevicePolicySyncHelper {

    private const val TAG = "DevicePolicySync"

    fun fetchAndSavePolicy(context: Context) {
        val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
        val deviceId = PolicyStore.getHeartbeatDeviceId(context) ?: return
        val token = PolicyStore.getHeartbeatToken(context) ?: return

        Thread {
            try {
                val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/policy")
                val connection = url.openConnection() as HttpURLConnection

                connection.requestMethod = "GET"
                connection.setRequestProperty("Authorization", "Bearer $token")
                connection.setRequestProperty("Content-Type", "application/json")
                connection.connectTimeout = 10000
                connection.readTimeout = 10000

                val responseCode = connection.responseCode
                if (responseCode !in 200..299) {
                    Log.e(TAG, "Policy fetch failed. responseCode=$responseCode")
                    connection.disconnect()
                    return@Thread
                }

                val body = connection.inputStream.bufferedReader().use { it.readText() }
                val root = JSONObject(body)
                val data = root.getJSONObject("data")
                val screenTime = data.getJSONObject("screenTime")

                val isLocked = data.optBoolean("isLocked", false)
                val isLimitEnabled = screenTime.optBoolean("isLimitEnabled", false)
                val dailyLimitMinutes = screenTime.optInt("dailyLimitMinutes", 0)
                val extraMinutesToday = screenTime.optInt("extraMinutesToday", 0)

                PolicyStore.setServerLocked(context, isLocked)
                PolicyStore.setLimitEnabled(context, isLimitEnabled)
                PolicyStore.setDailyLimit(context, dailyLimitMinutes)
                PolicyStore.setExtraMinutes(context, extraMinutesToday)

                Log.d(TAG, "Policy synced successfully")
                connection.disconnect()
            } catch (e: Exception) {
                Log.e(TAG, "Failed to fetch policy", e)
            }
        }.start()
    }
}