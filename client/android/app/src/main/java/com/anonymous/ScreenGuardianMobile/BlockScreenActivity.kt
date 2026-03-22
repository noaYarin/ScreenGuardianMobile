package com.anonymous.ScreenGuardianMobile

import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity

class BlockScreenActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Make the activity full screen
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        )

        setContentView(R.layout.activity_block_screen)
    }

    override fun onBackPressed() {
        // Disable normal back navigation while blocked
        // You can later change this behavior if needed
    }
}