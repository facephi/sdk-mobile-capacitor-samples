package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.widget.behavior.WgtBehaviorApplication;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    new WgtBehaviorApplication().initializeBehavior(this.getApplication());
  }
}
