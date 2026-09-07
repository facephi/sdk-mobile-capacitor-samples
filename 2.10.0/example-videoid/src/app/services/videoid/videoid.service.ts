import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';
import { SdkVideoIdPlugin, VideoIdResult, VideoMode } from '@facephi/sdk-videoid-capacitor';

const SdkVideoId = registerPlugin<SdkVideoIdPlugin>("SdkVideoId");

@Injectable({
  providedIn: 'root'
})
export class VideoidService {

  constructor() { }

  /**
   * Method that launches the plugin.
   * @param mode  Comment for parameter mode.
   * @param time  Comment for parameter time.
   * @returns Promise with a JSON string.
   */
  launchVideoId = async (): Promise<VideoIdResult> => {
    console.log('Launching videoId widget...');

    return SdkVideoId.startVideoId({
      mode: VideoMode.FACE_DOCUMENT_FRONT,
      sectionTime: 5000,
    });
  }
}