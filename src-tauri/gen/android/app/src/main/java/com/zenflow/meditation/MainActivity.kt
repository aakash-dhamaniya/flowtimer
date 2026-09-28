package com.zenflow.meditation

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.speech.tts.TextToSpeech
import android.util.Log
import android.graphics.Color
import java.util.Locale
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : TauriActivity(), TextToSpeech.OnInitListener {
  private var tts: TextToSpeech? = null
  private var isTtsReady = false
  private val pendingTexts = mutableListOf<String>()

  override fun onCreate(savedInstanceState: Bundle?) {
    // Notice: Do NOT call enableEdgeToEdge() so system status bar is not overlapped
    super.onCreate(savedInstanceState)

    try {
      window.statusBarColor = Color.parseColor("#090D16")
      window.navigationBarColor = Color.parseColor("#090D16")
      val controller = WindowInsetsControllerCompat(window, window.decorView)
      controller.isAppearanceLightStatusBars = false // Light/white icons on dark status bar
      controller.isAppearanceLightNavigationBars = false
    } catch (e: Exception) {
      Log.e("ZenFlow", "Error setting status bar color", e)
    }

    try {
      tts = TextToSpeech(applicationContext, this)
    } catch (e: Exception) {
      Log.e("ZenFlowTTS", "Failed to initialize TextToSpeech", e)
    }
  }

  override fun onInit(status: Int) {
    if (status == TextToSpeech.SUCCESS) {
      try {
        val result = tts?.setLanguage(Locale.getDefault())
        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
          tts?.setLanguage(Locale.US)
        }
        tts?.setSpeechRate(0.85f)
        isTtsReady = true
        Log.i("ZenFlowTTS", "TextToSpeech initialized successfully")

        // Speak any pending texts that were requested during initialization
        if (pendingTexts.isNotEmpty()) {
          for (text in pendingTexts) {
            tts?.speak(text, TextToSpeech.QUEUE_ADD, null, "ZenFlowPending_" + System.currentTimeMillis())
          }
          pendingTexts.clear()
        }
      } catch (e: Exception) {
        Log.e("ZenFlowTTS", "Error configuring TTS language", e)
      }
    } else {
      Log.e("ZenFlowTTS", "TextToSpeech initialization failed with status $status")
    }
  }

  override fun onWebViewCreate(webView: WebView) {
    super.onWebViewCreate(webView)

    // Calculate initial status bar height and inject CSS variable
    try {
      val resId = resources.getIdentifier("status_bar_height", "dimen", "android")
      val initialTopDp = if (resId > 0) {
        (resources.getDimensionPixelSize(resId) / resources.displayMetrics.density).toInt()
      } else {
        24
      }
      webView.post {
        webView.evaluateJavascript(
          "document.documentElement.style.setProperty('--safe-top', '${initialTopDp}px');",
          null
        )
      }

      // Dynamic listener for safe area insets
      ViewCompat.setOnApplyWindowInsetsListener(window.decorView) { _, insets ->
        val statusBars = insets.getInsets(WindowInsetsCompat.Type.statusBars())
        val navBars = insets.getInsets(WindowInsetsCompat.Type.navigationBars())
        val density = resources.displayMetrics.density
        val topDp = (statusBars.top / density).toInt()
        val bottomDp = (navBars.bottom / density).toInt()
        webView.evaluateJavascript(
          "document.documentElement.style.setProperty('--safe-top', '${topDp}px'); document.documentElement.style.setProperty('--safe-bottom', '${bottomDp}px');",
          null
        )
        insets
      }
    } catch (e: Exception) {
      Log.e("ZenFlow", "Error setting up safe area insets", e)
    }

    webView.addJavascriptInterface(object {
      @JavascriptInterface
      fun speak(text: String) {
        Handler(Looper.getMainLooper()).post {
          try {
            Log.i("ZenFlowTTS", "Speaking text: $text (Ready: $isTtsReady)")
            if (isTtsReady && tts != null) {
              tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "ZenFlow_" + System.currentTimeMillis())
            } else {
              pendingTexts.add(text)
              if (tts == null) {
                tts = TextToSpeech(applicationContext, this@MainActivity)
              }
            }
          } catch (e: Exception) {
            Log.e("ZenFlowTTS", "Exception in speak", e)
          }
        }
      }

      @JavascriptInterface
      fun stop() {
        Handler(Looper.getMainLooper()).post {
          try {
            pendingTexts.clear()
            tts?.stop()
          } catch (e: Exception) {
            Log.e("ZenFlowTTS", "Exception in stop", e)
          }
        }
      }

      @JavascriptInterface
      fun isAvailable(): Boolean {
        return isTtsReady
      }

      @JavascriptInterface
      fun setSpeechRate(rate: Float) {
        Handler(Looper.getMainLooper()).post {
          try {
            tts?.setSpeechRate(rate)
          } catch (e: Exception) {
            Log.e("ZenFlowTTS", "Exception in setSpeechRate", e)
          }
        }
      }
    }, "AndroidTTS")
  }

  override fun onDestroy() {
    try {
      tts?.stop()
      tts?.shutdown()
    } catch (e: Exception) {
      Log.e("ZenFlowTTS", "Exception shutting down TTS", e)
    }
    super.onDestroy()
  }
}
