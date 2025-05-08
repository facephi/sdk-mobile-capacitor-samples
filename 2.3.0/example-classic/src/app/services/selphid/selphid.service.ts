import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { registerPlugin } from '@capacitor/core';
import { SELPHID_RESOURCES_PATH } from './selphid.service.constants';

import { SdkSelphidPlugin, SelphIDResult, SelphIDDocumentType, SelphIDScanMode, SelphIDConfiguration } from '@facephi/sdk-selphid-capacitor';

const SdkSelphid = registerPlugin<SdkSelphidPlugin>("SdkSelphid");

@Injectable({
  providedIn: 'root'
})
export class SelphidService 
{
  constructor(public platform: Platform) { }

  /**
   * Method that launches the SelphID plugin with Search Mode.
   * @returns Promise with a JSON string.
   */
  launchSelphidCapture = async (): Promise<SelphIDResult> => 
  {
    console.log('Preparing selphID configuration...');

    let widgetConfig: SelphIDConfiguration = {
      //documentSide: SelphIDDocumentSide.Front,
      resourcesPath: SELPHID_RESOURCES_PATH,
      showResultAfterCapture: true,
      scanMode: SelphIDScanMode.Search,
      documentType: SelphIDDocumentType.IDCard,
      showTutorial: false,
      generateRawImages: false,
      specificData: `AR|<ALL>`,
      wizardMode: true,
    };

    console.log('Launching selphID widget...');
    return SdkSelphid.startCapture(widgetConfig);
  }

  setSelphidFlow = async (): Promise<SelphIDResult> => {
    console.log('Launching setSelphidFlow...');

    return SdkSelphid.setSelphidFlow();
  }
}