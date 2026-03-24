package com.screenguardianmobile

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import android.net.Uri

class BlockScreenActivity : AppCompatActivity() {

    companion object {
        var isOpen: Boolean = false
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_FULLSCREEN
                        or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                )

        setContentView(R.layout.activity_block_screen)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // Disable back while blocked
            }
        })

        val blockReason = intent.getStringExtra("blockReason") ?: ""
        val usedToday = intent.getIntExtra("usedTodayMinutes", 0)
        val dailyLimit = intent.getIntExtra("dailyLimitMinutes", 0)
        val extraMinutes = intent.getIntExtra("extraMinutes", 0)
        val effectiveLimit = dailyLimit + extraMinutes

        val titleText = findViewById<TextView>(R.id.titleText)
        val messageText = findViewById<TextView>(R.id.messageText)
        val hintText = findViewById<TextView>(R.id.hintText)
        val timeDetailsText = findViewById<TextView>(R.id.timeDetailsText)
        val iconText = findViewById<TextView>(R.id.iconText)
        val requestMoreTimeButton = findViewById<Button>(R.id.requestMoreTimeButton)
        val closeButton = findViewById<Button>(R.id.closeButton)

        timeDetailsText.text = "Used today: $usedToday / $effectiveLimit minutes"

        when (blockReason) {
            "LOCK_NOW" -> {
                iconText.text = "🔒"
                titleText.text = "Device locked by parent"
                messageText.text = "This device has been locked by your parent."
                hintText.text = "Please wait until your parent unlocks it."
                requestMoreTimeButton.visibility = View.GONE
                closeButton.text = "OK"
            }

            "DAILY_LIMIT_REACHED" -> {
                iconText.text = "⏳"
                titleText.text = "Daily screen time limit reached"
                messageText.text = "You have used all your screen time for today."
                hintText.text = "You can request more time from your parent."
                requestMoreTimeButton.visibility = View.VISIBLE
                closeButton.text = "I understand"
            }

            else -> {
                iconText.text = "⛔"
                titleText.text = "Device is currently blocked"
                messageText.text = "Access is temporarily restricted."
                hintText.text = "Please try again later."
                requestMoreTimeButton.visibility = View.GONE
                closeButton.text = "OK"
            }
        }

        requestMoreTimeButton.setOnClickListener {
            openAppToExtensionRequest()
        }

        closeButton.setOnClickListener {
            if (!PolicyStore.shouldLockDevice(this)) {
                finish()
            }
        }
    }

    override fun onResume() {
        super.onResume()
        isOpen = true

        // If the device was already unlocked, close this screen automatically
        if (!PolicyStore.shouldLockDevice(this)) {
            finish()
        }
    }

    override fun onStop() {
        super.onStop()
        isOpen = false
    }

    override fun onDestroy() {
        super.onDestroy()
        isOpen = false
    }

    private fun openAppToExtensionRequest() {
        val intent = Intent(
            Intent.ACTION_VIEW,
            Uri.parse("screenguardianmobile://Child/extendTime")
        ).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }

        startActivity(intent)
    }
}