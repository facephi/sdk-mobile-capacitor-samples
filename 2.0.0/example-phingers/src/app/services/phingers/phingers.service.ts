import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';
import { SdkPhingersPlugin, PhingersResult, PhingersCaptureOrientation } from '@facephi/sdk-phingers-capacitor';

const SdkPhingers = registerPlugin<SdkPhingersPlugin>("SdkPhingers");

@Injectable({
  providedIn: 'root'
})
export class PhingersService 
{
  constructor() { }

  /**
   * Method that launches the plugin using the authentication with liveness passive mode.
   * @param reticleOrientation  Comment for parameter ´debug´.
   * @param returnFullFrameImage  Comment for parameter ´livenessMode´.
   * @param returnProcessedImage  Comment for parameter ´resourcesPath´.
   * @returns Promise with a JSON string.
   */
  launchPhingers = async (): Promise<PhingersResult> => 
  {
    console.log('Launching Phingers widget...');

    return SdkPhingers.startPhingers({
      reticleOrientation: PhingersCaptureOrientation.THUMB,
      returnFullFrameImage: true,
      returnProcessedImage: true,
      returnRawImage: true,
      useFlash: true,
      useLiveness: true,
    });
  }
}