package com.screenguardianmobile

import android.os.Bundle
import android.view.View
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class BlockScreenActivity : AppCompatActivity() {

    companion object {
        var isOpen: Boolean = false
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        isOpen = true

        // Make the activity full screen
        window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_FULLSCREEN
                        or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                )

        setContentView(R.layout.activity_block_screen)

        val blockReason = intent.getStringExtra("blockReason")

        val titleText = findViewById<TextView>(R.id.titleText)
        val messageText = findViewById<TextView>(R.id.messageText)
        val hintText = findViewById<TextView>(R.id.hintText)

        when (blockReason) {
            "LOCK_NOW" -> {
                titleText.text = "Device locked by parent"
                messageText.text = "This device has been locked by your parent."
                hintText.text = "Please wait until your parent unlocks it."
            }

            "DAILY_LIMIT_REACHED" -> {
                titleText.text = "Daily screen time limit reached"
                messageText.text = "You have used all your screen time for today."
                hintText.text = "You can request more time from your parent."
            }

            else -> {
                titleText.text = "Device is currently blocked"
                messageText.text = "Access is temporarily restricted."
                hintText.text = "Please try again later."
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        isOpen = false
    }

    override fun onBackPressed() {
        // Disable normal back navigation while blocked
    }
}