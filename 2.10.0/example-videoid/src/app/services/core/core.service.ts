import { Injectable } from '@angular/core';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { SdkCorePlugin, CoreResult, SdkOperationType, InitSessionConfiguration, InitOperationConfiguration } from '@facephi/sdk-core-capacitor';
import { CUSTOMER_ID, LICENSE_APIKEY_ANDROID, LICENSE_APIKEY_IOS, LICENSE_STRING_ANDROID, LICENSE_STRING_IOS, LICENSE_URL } from 'src/app/constants';

const SdkCore = registerPlugin<SdkCorePlugin>("SdkCore");

@Injectable({
  providedIn: 'root'
})
export class CoreService 
{
  constructor() { }       

  initOperation = async (): Promise<CoreResult> => {
    console.log('Launching launchInitOperation widget...');

    const widgetConfig: InitOperationConfiguration = {
      type: SdkOperationType.Onboarding,
      customerId: CUSTOMER_ID,
    };
    return SdkCore.initOperation(widgetConfig);
  }

  closeSession = async (): Promise<any> => {
    console.log('Launching closeSession...');

    return SdkCore.closeSession();
  };

  initSession = async (): Promise<any> => 
  {
    console.log('Launching initSession...');

    let pluginLicense: string = (Capacitor.getPlatform() === 'ios') ? JSON.stringify(LICENSE_STRING_IOS) : JSON.stringify(LICENSE_STRING_ANDROID);
    let pluginLicenseApiKey: string = (Capacitor.getPlatform() === 'ios') ? LICENSE_APIKEY_IOS : LICENSE_APIKEY_ANDROID;

    const widgetConfig: InitSessionConfiguration = {
      //license: pluginLicense,
      licenseUrl: LICENSE_URL,
      licenseApiKey: pluginLicenseApiKey,
      enableTracking: true
    };

    return SdkCore.initSession(widgetConfig);
  };

  getExtraData = async (): Promise<CoreResult> => 
  {
    console.log('Launching getExtraData...');

    return SdkCore.getExtraData();
  }
}