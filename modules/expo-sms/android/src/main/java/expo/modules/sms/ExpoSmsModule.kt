package expo.modules.sms

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import android.Manifest
import android.content.pm.PackageManager
import android.database.Cursor
import android.net.Uri
import android.provider.Telephony
import androidx.core.content.ContextCompat
import java.net.URL

class ExpoSmsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSms")
    
    Constants(
      "PI" to Math.PI
    )
    
    Events("onChange")
    
    Function("hello") {
      "Hello world! 👋"
    }
    
    AsyncFunction("setValueAsync") { value: String ->
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }
    
    // New function to read SMS messages
    AsyncFunction("getSmsMessagesAsync") { type: String?, promise: Promise ->
      try {
        // Check if READ_SMS permission is granted
        if (ContextCompat.checkSelfPermission(
            appContext.reactContext ?: throw Exception("React context is null"),
            Manifest.permission.READ_SMS
          ) != PackageManager.PERMISSION_GRANTED) {
          promise.reject("PERMISSION_DENIED", "READ_SMS permission is not granted", null)
          return@AsyncFunction
        }
        
        val smsMessages = readSmsMessages(type)
        promise.resolve(smsMessages)
      } catch (e: Exception) {
        promise.reject("SMS_READ_ERROR", "Failed to read SMS messages: ${e.message}", e)
      }
    }
    
    // Function to get SMS messages count
    AsyncFunction("getSmsCountAsync") { type: String?, promise: Promise ->
      try {
        if (ContextCompat.checkSelfPermission(
            appContext.reactContext ?: throw Exception("React context is null"),
            Manifest.permission.READ_SMS
          ) != PackageManager.PERMISSION_GRANTED) {
          promise.reject("PERMISSION_DENIED", "READ_SMS permission is not granted", null)
          return@AsyncFunction
        }
        
        val count = getSmsCount(type)
        promise.resolve(count)
      } catch (e: Exception) {
        promise.reject("SMS_COUNT_ERROR", "Failed to get SMS count: ${e.message}", e)
      }
    }
    
    // Function to check if READ_SMS permission is granted
    Function("hasReadSmsPermission") {
      ContextCompat.checkSelfPermission(
        appContext.reactContext ?: return@Function false,
        Manifest.permission.READ_SMS
      ) == PackageManager.PERMISSION_GRANTED
    }
    
    View(ExpoSmsView::class) {
      Prop("url") { view: ExpoSmsView, url: URL ->
        view.webView.loadUrl(url.toString())
      }
      Events("onLoad")
    }
  }
  
  private fun readSmsMessages(type: String?): List<Map<String, Any?>> {
    val smsMessages = mutableListOf<Map<String, Any?>>()
    val contentResolver = appContext.reactContext?.contentResolver
      ?: throw Exception("Content resolver is null")
    
    // Determine the URI based on type
    val uri = when (type?.lowercase()) {
      "inbox" -> Telephony.Sms.Inbox.CONTENT_URI
      "sent" -> Telephony.Sms.Sent.CONTENT_URI
      "draft" -> Telephony.Sms.Draft.CONTENT_URI
      "outbox" -> Telephony.Sms.Outbox.CONTENT_URI
      else -> Telephony.Sms.CONTENT_URI // All messages
    }
    
    // Columns to retrieve
    val columns = arrayOf(
      Telephony.Sms._ID,
      Telephony.Sms.ADDRESS,
      Telephony.Sms.BODY,
      Telephony.Sms.DATE,
      Telephony.Sms.TYPE,
      Telephony.Sms.READ,
      Telephony.Sms.THREAD_ID,
      Telephony.Sms.PERSON,
      Telephony.Sms.SERVICE_CENTER
    )
    
    var cursor: Cursor? = null
    try {
      cursor = contentResolver.query(
        uri,
        columns,
        null,
        null,
        "${Telephony.Sms.DATE} DESC" // Sort by date, newest first
      )
      
      cursor?.use { c ->
        val idIndex = c.getColumnIndex(Telephony.Sms._ID)
        val addressIndex = c.getColumnIndex(Telephony.Sms.ADDRESS)
        val bodyIndex = c.getColumnIndex(Telephony.Sms.BODY)
        val dateIndex = c.getColumnIndex(Telephony.Sms.DATE)
        val typeIndex = c.getColumnIndex(Telephony.Sms.TYPE)
        val readIndex = c.getColumnIndex(Telephony.Sms.READ)
        val threadIdIndex = c.getColumnIndex(Telephony.Sms.THREAD_ID)
        val personIndex = c.getColumnIndex(Telephony.Sms.PERSON)
        val serviceCenterIndex = c.getColumnIndex(Telephony.Sms.SERVICE_CENTER)
        
        while (c.moveToNext()) {
          val smsMessage = mapOf<String, Any?>(
            "id" to if (idIndex >= 0) c.getString(idIndex) else null,
            "address" to if (addressIndex >= 0) c.getString(addressIndex) else null,
            "body" to if (bodyIndex >= 0) c.getString(bodyIndex) else null,
            "date" to if (dateIndex >= 0) c.getLong(dateIndex) else null,
            "type" to if (typeIndex >= 0) c.getInt(typeIndex) else null,
            "read" to if (readIndex >= 0) c.getInt(readIndex) == 1 else null,
            "threadId" to if (threadIdIndex >= 0) c.getLong(threadIdIndex) else null,
            "person" to if (personIndex >= 0) c.getString(personIndex) else null,
            "serviceCenter" to if (serviceCenterIndex >= 0) c.getString(serviceCenterIndex) else null
          )
          smsMessages.add(smsMessage)
        }
      }
    } catch (e: Exception) {
      throw Exception("Error reading SMS messages: ${e.message}")
    }
    
    return smsMessages
  }
  
  private fun getSmsCount(type: String?): Int {
    val contentResolver = appContext.reactContext?.contentResolver
      ?: throw Exception("Content resolver is null")
    
    val uri = when (type?.lowercase()) {
      "inbox" -> Telephony.Sms.Inbox.CONTENT_URI
      "sent" -> Telephony.Sms.Sent.CONTENT_URI
      "draft" -> Telephony.Sms.Draft.CONTENT_URI
      "outbox" -> Telephony.Sms.Outbox.CONTENT_URI
      else -> Telephony.Sms.CONTENT_URI
    }
    
    var cursor: Cursor? = null
    return try {
      cursor = contentResolver.query(uri, null, null, null, null)
      cursor?.count ?: 0
    } catch (e: Exception) {
      throw Exception("Error counting SMS messages: ${e.message}")
    } finally {
      cursor?.close()
    }
  }
}
