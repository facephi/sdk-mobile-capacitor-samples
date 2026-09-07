import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CoreService } from '../services/core/core.service';
import { SdkErrorType, CoreResult, SdkFinishStatus } from '@facephi/sdk-core-capacitor';
import { VideoidService } from '../services/videoid/videoid.service';
import { VideoIdResult } from '@facephi/sdk-videoid-capacitor';

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
  videoIdService: VideoidService

  message: string = '';
  isListExpanded: boolean = false;
  showError: boolean = false;

  constructor(
    coreService: CoreService,
    videoIdService: VideoidService,
    private changeDetection: ChangeDetectorRef
  ) 
  {
    this.coreService = coreService;
    this.videoIdService = videoIdService;
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
    });;
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

  onLaunchVideoIdProcess = async () => {
    this.message = '';
    await this.videoIdService.launchVideoId()
    .then((result: VideoIdResult) => console.log(result), (err: string) => console.log(err));
  }

  onInitOperation = async () => {
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
    });;
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