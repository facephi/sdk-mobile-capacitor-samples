import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PhingersService } from '../services/phingers/phingers.service';
import { CoreService } from '../services/core/core.service';
import { SdkErrorType, CoreResult, SdkFinishStatus } from '@facephi/sdk-core-capacitor';
import { PhingersResult } from '@facephi/sdk-phingers-capacitor';

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
  phingersService: PhingersService;

  message: string = '';
  isListExpanded: boolean = false;
  showError: boolean = false;

  constructor(
    phingersService: PhingersService,
    coreService: CoreService,
    private changeDetection: ChangeDetectorRef
  ) 
  {
    this.phingersService = phingersService;
    this.coreService = coreService;
  }

  onInitOperation = async () => {
    this.message = '';
    await this.coreService.initOperation()
    .then((result: CoreResult) => {
      console.log(result);
      if (result.finishStatus == SdkFinishStatus.Error) {
        this.printError(result['errorType']);
      }
    }, 
    (err: string) => console.log(err))
    .finally(() => {
      this.changeDetection.detectChanges()
    });
  }

  onInitSession = async () => {
    this.message = '';
    await this.coreService.initSession()
    .then((result: CoreResult) => {
      console.log(result);
      if (result.finishStatus == SdkFinishStatus.Error) {
        this.printError(result['errorType']);
      }
    }, 
    (err: any) => console.log(err))
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

  onLaunchPhingersProcess = async () => {
    this.message = '';
    await this.phingersService.launchPhingers()
    .then((result: PhingersResult) => {
      console.log(result);
    }, 
    (err: string) => console.log(err));
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