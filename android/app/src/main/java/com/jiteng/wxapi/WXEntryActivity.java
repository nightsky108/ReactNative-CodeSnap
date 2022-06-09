package com.jiteng.wxapi;

import android.app.Activity;
import android.os.Bundle;
import com.reactnativewechatsdk.WeChatSdkModule;

public class WXEntryActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WeChatSdkModule.handleIntent(getIntent());
        finish();
    }
}
