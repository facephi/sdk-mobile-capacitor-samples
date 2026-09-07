import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CoreService } from '../services/core/core.service';
import { SdkErrorType, CoreResult, SdkFinishStatus } from '@facephi/sdk-core-capacitor';
import { FacephiService } from '../api/api-rest/facephi.service';
import { VoiceService } from '../services/voice/voice.service';
import { VoiceResult } from '@facephi/sdk-voice-capacitor';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  // UriImage header for base64 images visualization.
  URI_JPEG_HEADER = 'data:image/jpeg;base64,';

  coreService: CoreService
  voiceService: VoiceService;
  apiRest: FacephiService;

  message: string = '';
  isListExpanded: boolean = false;
  showError: boolean = false;

  constructor(
    coreService: CoreService,
    voiceService: VoiceService,
    apiRest: FacephiService,
    private changeDetection: ChangeDetectorRef
  ) 
  {
    this.coreService = coreService;
    this.voiceService = voiceService;
    this.apiRest = apiRest;
  }

  toogleChange = () => {
      // Query for the toggle that is used to change between themes
      const toggle = document.getElementsByTagName('body');
      console.log(toggle[0].getAttribute("color-theme"));
      toggle[0].setAttribute("color-theme", "light");
  }

  onInitSession = async () => {
    this.message = '';
    await this.coreService.initSession()
    .then((result: CoreResult) => {
      console.log(result);
      if (result.finishStatus == SdkFinishStatus.Error) {
        this.printError(result['errorType']);
      }
    }, (err: any) => console.log(err))
    .finally(() => {
      this.changeDetection.detectChanges()
    });
  }

  onCloseSession = async () => {
    this.message = '';
    await this.coreService.closeSession()
    .then((result: CoreResult) => 
    {
      console.log(result)
    },
    (err: any) => console.log(err));
  }

  onLaunchVoiceProcess = async () => {
    this.message = '';
    await this.voiceService.launchVoice()
    .then((result: VoiceResult) => console.log(result), (err: string) => console.log(err));
  }

  onLaunchInitOperationProcess = async () => {
    this.message = '';
    await this.coreService.initOperation()
    .then((result: CoreResult) => {
      console.log(result);
      if (result.finishStatus == SdkFinishStatus.Error) {
        this.printError(result['errorType']);
      }
    }, (err: string) => console.log(err))
    .finally(() => {
      this.changeDetection.detectChanges()
    });
  }

  private printError(error: string)
  {
    this.message = this.replaceUnderscores(error);
  }

  private replaceUnderscores(text: string): string
  {
    return text.replace(/_/g, ' ');
  }
}