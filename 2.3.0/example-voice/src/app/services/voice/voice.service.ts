import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';
import { SdkVoicePlugin, VoiceConfiguration, VoiceResult } from '@facephi/sdk-voice-capacitor';
import { Platform } from '@ionic/angular';

const SdkVoice = registerPlugin<SdkVoicePlugin>("SdkVoice");

@Injectable({
  providedIn: 'root'
})
export class VoiceService 
{
  constructor(public platform: Platform) { }

  /**
  * Method that launches the plugin.
  * @param phrases  Comment for parameter phrases.
  * @param showTutorial  Comment for parameter showTutorial.
  * @param vibrationEnabled  Comment for parameter vibrationEnabled.
  * @returns Promise with a JSON string.
  */
  launchVoice = async (): Promise<VoiceResult> => 
  {
    console.log('Launching VoicePlugin widget...');
    return SdkVoice.startVoice(this.getVoiceSettings());
  }

  getVoiceSettings = () => 
  {
    let config: VoiceConfiguration = 
    {
      phrases: 'hola mundo cruel|hola voice component',
      showTutorial: false,
      vibrationEnabled: true,
      timeout: 50000,
      returnAudios: true,
      returnTokenizedAudios: true
    };

    return config;
  }

  setVoiceFlow = async (): Promise<any> => 
  {
    console.log('Launching setVoiceFlow...');
    return SdkVoice.setVoiceFlow();
  }
}