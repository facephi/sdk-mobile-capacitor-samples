import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { registerPlugin } from '@capacitor/core';
import { SELPHI_RESOURCES_PATH } from './selphi.service.constants';
import { SdkSelphiPlugin, SelphiFaceResult, SelphiFaceLivenessMode, SelphiFaceConfiguration } from '@facephi/sdk-selphi-iad-capacitor';

const SdkSelphi = registerPlugin<SdkSelphiPlugin>("SdkSelphi");

@Injectable({
  providedIn: 'root'
})
export class SelphiService {

  constructor(public platform: Platform) { }

  /**
   * Method that launches the plugin using the authentication with liveness passive mode.
   * @param debug  Comment for parameter ´debug´.
   * @param livenessMode  Comment for parameter ´livenessMode´.
   * @param resourcesPath  Comment for parameter ´resourcesPath´.
   * @returns Promise with a JSON string.
   */
  launchSelphiAuthentication = async (): Promise<SelphiFaceResult> => {
    console.log('Launching selphi widget...');
    
    // SelphiFaceConfiguration
    let config: SelphiFaceConfiguration = {
      debug: false,
      livenessMode: SelphiFaceLivenessMode.Passive,
      resourcesPath: SELPHI_RESOURCES_PATH,
      enableGenerateTemplateRaw: true
    }
    return SdkSelphi.startExtraction(config);
  }

  setSelphiFlow = async (): Promise<SelphiFaceResult> => {
    console.log('Launching setSelphiFlow...');

    return SdkSelphi.setSelphiFlow();
  }
}