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
   * @returns Promise with a JSON string.
   */
  launchPhingers = async (): Promise<PhingersResult> => 
  {
    console.log('Launching Phingers widget...');

    return SdkPhingers.startPhingers({
      reticleOrientation: PhingersCaptureOrientation.LEFT,
      useLiveness: true,
    });
  }
}