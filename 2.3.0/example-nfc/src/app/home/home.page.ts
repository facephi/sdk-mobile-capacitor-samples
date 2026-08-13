import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NfcService } from '../services/nfc/nfc.service';
import { CoreService } from '../services/core/core.service';
import { SdkFinishStatus, SdkErrorType, CoreResult, SdkCorePlugin } from '@facephi/sdk-core-capacitor';
import { NfcResult } from '@facephi/sdk-nfc-capacitor';
import { FacephiService } from '../api/api-rest/facephi.service';
import { registerPlugin } from '@capacitor/core';

const SdkCore = registerPlugin<SdkCorePlugin>("SdkCore");

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage 
{
  // UriImage header for base64 images visualization.
  URI_JPEG_HEADER = 'data:image/jpeg;base64,';

  coreService: CoreService
  nfcService: NfcService;
  apiRest: FacephiService;

  message: string = '';
  isListExpanded: boolean = false;
  showError: boolean = false;
  //listener: any;
  listener: any = SdkCore.addListener('core.flow', (response: any) => 
  {
    console.log("core.flow:", response);
  });

  constructor
  (
    nfcService: NfcService,
    coreService: CoreService,
    apiRest: FacephiService,
    private changeDetection: ChangeDetectorRef
  ) 
  {
    this.nfcService = nfcService;
    this.coreService = coreService;
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

  onLaunchNfcProcess = async () => {
    this.message = '';
    await this.nfcService.launchNfc()
    .then((result: NfcResult) => console.log(result), (err: string) => console.log(err));
  }

  onLaunchInitOperationProcess = async () => {
    this.message = '';
    await this.coreService.initOperation()
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

  private printError(error: string)
  {
    this.message = this.replaceUnderscores(error);
  }

  private replaceUnderscores(text: string): string
  {
    return text.replace(/_/g, ' ');
  }
}