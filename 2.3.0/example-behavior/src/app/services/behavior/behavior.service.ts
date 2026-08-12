import { Injectable } from '@angular/core';
import { PluginListenerHandle, registerPlugin } from '@capacitor/core';
import { WgtBehaviorPlugin, WgtBehaviorResult, WgtBehaviorConfiguration } from '@fip360/widget-behavior-capacitor';
import { Capacitor } from '@capacitor/core';
import { LICENSE_APIKEY_ANDROID, LICENSE_APIKEY_IOS, WGT_BEHAVIOR_EVENTS } from 'src/app/constants';

const WgtBehavior = registerPlugin<WgtBehaviorPlugin>('WgtBehavior');

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {
  sessionId: string = '';
  userId: string = '';

  constructor() {}

  initialize = async (): Promise<WgtBehaviorResult> => {
    console.log('Launching initialize...');

    const licenseKey =
      Capacitor.getPlatform() === 'ios' ? LICENSE_APIKEY_IOS : LICENSE_APIKEY_ANDROID;

    const widgetConfig: WgtBehaviorConfiguration = {
      licenseKey,
      enableSupportLogs: true,
    };

    return WgtBehavior.initialize(widgetConfig);
  };

  clearSessionData = async (): Promise<WgtBehaviorResult> => {
    return WgtBehavior.clearSessionData();
  };

  setAutoLogoutAction = async (): Promise<WgtBehaviorResult> => {
    return WgtBehavior.setAutoLogoutAction();
  };

  setUserId = async (userId: string): Promise<WgtBehaviorResult> => {
    return WgtBehavior.setUserId({ userId });
  };

  setSessionId = async (sessionId: string): Promise<WgtBehaviorResult> => {
    return WgtBehavior.setSessionId({ sessionId });
  };

  setPosition = async (position: string): Promise<WgtBehaviorResult> => {
    return WgtBehavior.setPosition({ position });
  };

  addEventsListener = (callback: (response: any) => void): Promise<PluginListenerHandle> => {
    return WgtBehavior.addListener(WGT_BEHAVIOR_EVENTS, callback);
  };
}
