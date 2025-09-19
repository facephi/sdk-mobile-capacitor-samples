import { Injectable } from '@angular/core';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { SdkCorePlugin, CoreResult, InitSessionConfiguration, InitOperationConfiguration, SdkOperationType, InitFlowConfiguration } from '@facephi/sdk-core-capacitor';
import { CUSTOMER_ID, LICENSE_APIKEY_ANDROID, LICENSE_APIKEY_IOS, LICENSE_STRING_ANDROID, LICENSE_STRING_IOS, LICENSE_URL } from 'src/app/constants';

const SdkCore = registerPlugin<SdkCorePlugin>("SdkCore");

@Injectable({
  providedIn: 'root'
})
export class CoreService 
{
  constructor() { }       

  /**
   * Method that launches the Tracking.
   * @param type  Comment for parameter type.
   * @param customerId  Comment for parameter customerId.
   * @returns Promise with a JSON string.
  */
  initOperation = async (): Promise<CoreResult> => {
    console.log('Launching launchInitOperation widget...');

    const widgetConfig: InitOperationConfiguration = {
      type: SdkOperationType.Onboarding,
      customerId: CUSTOMER_ID,
    };
    return SdkCore.initOperation(widgetConfig);
  }

  closeSession = async (): Promise<CoreResult> => {
    console.log('Launching closeSession...');

    return SdkCore.closeSession();
  };

  initSession = async (): Promise<CoreResult> => 
  {
    console.log('Launching initSession...');

    let pluginLicense: string = (Capacitor.getPlatform() === 'ios') ? LICENSE_STRING_IOS : LICENSE_STRING_ANDROID;
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

  initFlow = async (): Promise<CoreResult> => 
  {
    console.log('Launching initFlow...');

    const widgetConfig: InitFlowConfiguration = {
      flow: "FLOW_B",
      customerId: CUSTOMER_ID
    };

    return SdkCore.initFlow(widgetConfig);
  };

  startFlow = async (): Promise<CoreResult> => 
  {
    console.log('Launching startFlow...');
    return SdkCore.startFlow();
  };
}