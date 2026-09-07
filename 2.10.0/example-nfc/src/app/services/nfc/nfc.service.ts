import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';
import { SdkNfcPlugin, NfcResult, NfcConfiguration } from '@facephi/sdk-nfc-capacitor';
import { Platform } from '@ionic/angular';

const SdkNfc = registerPlugin<SdkNfcPlugin>("SdkNfc");

@Injectable({
  providedIn: 'root'
})
export class NfcService 
{
  constructor(public platform: Platform) { }

  /**
   * Method that launches the plugin using the authentication with liveness passive mode.
   * @param docNumber  Comment for parameter docNumber.
   * @param birthDate  Comment for parameter birthDate.
   * @param expirationDate  Comment for parameter expirationDate.
   * @returns Promise with a JSON string.
  */
  launchNfc = async (): Promise<NfcResult> => {
    console.log('Launching Nfc widget...');
    // SelphiFaceConfiguration
    return SdkNfc.startNfc(this.getNFCConfiguration());
  }

  getNFCConfiguration() 
  {
    let config: NfcConfiguration = {
      docNumber: 'AAA439684',
      birthDate: '16/08/1979',
      expirationDate: '29/11/2022',
      extractionTimeout: 5000,
    };
    return config;
  }

  setNfcFlow = async (): Promise<NfcResult> => {
    console.log('Launching setNfcFlow...');

    return SdkNfc.setNfcFlow();
  }
}