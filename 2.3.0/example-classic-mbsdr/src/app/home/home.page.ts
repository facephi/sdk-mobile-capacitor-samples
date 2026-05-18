import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SelphiService } from '../services/selphi-face/selphi.service';
import { SelphidService } from '../services/selphid/selphid.service';
import { CoreService } from '../services/core/core.service';
import { SelphiFaceResult  } from '@facephi/sdk-selphi-iad-capacitor';
import { SelphIDResult } from '@facephi/sdk-selphid-mbsdr-capacitor';
import { SdkFinishStatus, CoreResult, SdkCorePlugin } from '@facephi/sdk-core-capacitor';
import { APP_DARK_MODE_STORAGE_KEY } from '../constants';
import { FacephiService } from '../api/api-rest/facephi.service';
import { registerPlugin } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { FlowsResult } from '../models/flows-result';
import { parseFlowsIntegrationData } from '../utils/parse-flows-integration-data';

const SdkCore = registerPlugin<SdkCorePlugin>("SdkCore");

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit
{
  // UriImage header for base64 images visualization.
  URI_JPEG_HEADER = 'data:image/jpeg;base64,';

  selphiFaceService: SelphiService;
  selphidService: SelphidService;
  coreService: CoreService;
  apiRest: FacephiService;

  message: string                         = '';
  selphiResult?: SelphiFaceResult | null  = null;
  selphidResult?: SelphIDResult | null    = null;
  isOcrSheetOpen: boolean                 = false;
  flows: FlowsResult[]                    = [];
  selectedFlowId: string | null           = null;
  isFlowsSheetOpen: boolean               = false;
  isDarkMode: boolean                     = false;

  listener: any = SdkCore.addListener('core.flow', (response: any) => 
  {
    console.log("core.flow:", response);
  });

  listenerTracking: any = SdkCore.addListener('tracking.error.listener', (response: any) => 
  {
    console.log("tracking.error.listener:", response);
  });

  constructor
  (
    selphidService: SelphidService, 
    selphiService: SelphiService,
    coreService: CoreService,
    apiRest: FacephiService,
    private loadingCtrl: LoadingController,
    private changeDetection: ChangeDetectorRef
  ) 
  {
    this.apiRest = apiRest;
    this.selphiFaceService = selphiService;
    this.selphidService = selphidService;
    this.coreService = coreService;
  }

  ngOnInit(): void {
    this.isDarkMode = document.body.classList.contains('app-dark-mode');
  }

  /** Activa o desactiva el tema oscuro Ionic (`variables.scss` + `body.app-dark-mode`). */
  toogleChange = (event: Event): void => 
  {
    const detail = (event as CustomEvent<{ checked: boolean }>).detail;
    const dark = !!detail?.checked;
    document.body.classList.toggle('app-dark-mode', dark);
    document.documentElement.style.setProperty('color-scheme', dark ? 'dark' : 'light');
    try {
      localStorage.setItem(APP_DARK_MODE_STORAGE_KEY, dark ? '1' : '0');
    } catch {
      /* modo privado u otro bloqueo */
    }
    this.isDarkMode = dark;
    this.changeDetection.markForCheck();
  };

  launchGetFlowIntegrationData = async () => 
  {
    this.message = "";
    console.log("Starting launchGetFlowIntegrationData...");

    return await this.coreService.getFlowIntegrationData()
    .then((result: CoreResult) =>
    {
      switch (result.finishStatus)
      {
        case SdkFinishStatus.Ok:
          console.log("getFlowIntegrationData:", result);
          // result.data puede ser array (iOS), JSON string, o string estilo Java toString() en Android — no usar JSON.parse solo.
          this.flows = parseFlowsIntegrationData(result.data);
          if (this.flows.length > 0) {
            this.isFlowsSheetOpen = true;
          }
          this.changeDetection.markForCheck();
          break;

        case SdkFinishStatus.Error:
          this.printError(result.errorType);
          break;
      }
    })
    .finally(() => {
      console.log("End launchGetFlowIntegrationData...");
    })
    .catch((err: any) => console.log("Error launchGetFlowIntegrationData:", err));
  }

  onLaunchFlow = async () => 
  {
    this.message = '';
      
    /* se agrega el nuevo método que escucha los eventos 
    this.listener = SdkCore.addListener('core.flow', (response: any) => {
      console.log('core.flow was fired');
      console.log("core.flow:", response);
    });*/

    await this.coreService.initFlow(this.selectedFlowId!!)
    .then(async (result: CoreResult) => 
    {
      if (result.finishStatus == SdkFinishStatus.Ok)
      {
        await this.selphiFaceService.setSelphiFlow()
          .then((res: SelphiFaceResult) => console.log("setSelphiFlow res", res))
          .catch((err) => console.log("setSelphiFlow err", err));

        await this.selphidService.setSelphidFlow()
          .then((res: SelphIDResult) => console.log("setSelphidFlow res", res))
          .catch((err) => console.log("setSelphidFlow err", err));

        await this.coreService.startFlow()
          .then((res: CoreResult) => console.log("startFlow res", res))
          .catch((err) => console.log("startFlow err", err));
      }
    }, 
    (err: any) => console.log(err));
  }

  onInitSession = async () => {
    this.message = '';
    await this.coreService.initSession()
    .then(
      (result: CoreResult) => console.log(result), 
      (err: any) => this.printError(err)
    );
  }

  onCloseSession = async () => 
  {
    this.message = '';
    await this.coreService.closeSession()
    .then((result: CoreResult) => 
    {
      console.log(result)
    },
    (err: any) => this.printError(err));
  }

  onGetExtraData = async () => 
  {
    this.message  = '';
    let loading   = await this.loadingCtrl.create({
      message: 'Requesting ...',
    });

    await this.coreService.getExtraData()
    .then((result: CoreResult) => 
    {
      console.log(result);

      if (result.finishStatus == SdkFinishStatus.Ok) 
      {
        if (this.selphidResult?.tokenOCR !== "") 
        {
          loading.present();
          this.apiRest.extractDocumentData(this.selphidResult?.tokenOCR!!)
          .then((res: any) => 
          { 
            console.log("extractDocumentData", res) 
          })
          .catch((e: any) => 
          { 
            console.error(e) 
          })
          .finally(() => 
          { 
            console.info('extractDocumentData -> complete') 
            loading.dismiss();
          });
        }
        
        if (this.selphiResult?.bestImage !== null && this.selphidResult?.faceImage !== null) 
        {
          loading.present();
          this.apiRest.authenticalFacial(this.selphidResult?.faceImage!!, this.selphiResult?.bestImage!!)
          .then((res: any) => 
          { 
            console.log("authenticalFacial", res) 
          })
          .catch((e: any) => 
          { 
            console.error(e) 
          })
          .finally(() => 
          { 
            console.info('authenticalFacial -> complete') 
            loading.dismiss();
          });
        }

        if (this.selphidResult?.rawBackDocument !== null && this.selphidResult?.rawFrontDocument !== null) 
        {
          loading.present();
          this.apiRest.documentValidation(this.selphidResult?.rawFrontDocument!!, this.selphidResult?.rawBackDocument!!)
          .then((res: any) => 
          { 
            console.log("documentValidation", res)
            if (res && res.data !== null && res.data.scanReference !== null && res.data.typeResult !== null) 
            {
              loading.present();
              this.apiRest.documentValidationStatus(res.data.scanReference, res.data.typeResult)
              .then((res: any) => 
              { 
                console.log("documentValidationStatus", res)
              })
              .catch((e: any) => 
              { 
                console.error(e) 
              })
              .finally(() => 
              { 
                console.info('documentValidationStatus -> complete') 
                loading.dismiss();
              });
            }
          })
          .catch((e: any) => 
          { 
            console.error(e) 
          })
          .finally(() => 
          { 
            console.info('documentValidation -> complete') 
            loading.dismiss();
          });
        }
      }
    }, 
    (err: any) => console.log(err));
  }

  onLaunchInitOperationProcess = async () => {
    this.message = '';
    await this.coreService.initOperation()
    .then(
      (result: CoreResult) => console.log(result),
      (err: string) => this.printError(err)
    );
  }

  onLaunchSelphiProcess = async () => 
  {
    this.message      = '';
    this.selphiResult = null;
    await this.selphiFaceService.launchSelphiAuthentication()
    .then(
      (result: SelphiFaceResult) => this.onSuccessSelphiExtraction(result), 
      (err: string) => this.printError(err)
    );
  }

  //  Formatting output
  onSuccessSelphiExtraction = (result: SelphiFaceResult) => 
  {
    console.log('Receiving selphi success event...');
    if (result !== null && result) 
    {
      switch (result.finishStatus) 
      {
        case SdkFinishStatus.Ok: // OK
          this.processSelphiSuccessResult(result); // Logging the info for debug purposes
          this.selphiResult                   = result;
          this.selphiResult!.bestImageCropped = this.URI_JPEG_HEADER + result.bestImageCropped;
          this.message                        = "";

          if (result.iad !== null) {
            console.log(result.iad!);
            this.apiRest.callIAD(result.iad!)
              .then(
                (res: any) => {
                  console.log("callIAD", res)
                }
              )
              .catch(
                (e: any) => {
                  console.error(e)
                }
              );

            this.apiRest.callIADByBytes(result.iad!)
              .then(
                (res: any) => {
                  console.log("callIADByBytes", res)
                }
              )
              .catch(
                (e: any) => {
                  console.error(e)
                }
              );
          }
          break;

        case SdkFinishStatus.Error: // Error
          this.printError(result.errorType);
          break;

        default:
          console.log('Receiving selphi plugin error event...', result);
          this.printError('An error has ocurred. Read the log for more info');
          break;
      }
      this.changeDetection.detectChanges();
    }
  }

  /** Method implemented only for debug purposes */
  processSelphiSuccessResult = (result: SelphiFaceResult) => {
    const message =
   `* FinishStatus: ' ${ result.finishStatus }
    * errorType: ' ${ result.errorType }
    * TemplateRaw length: ' ${ result.templateRaw?.length }
    * BestImage length: ' ${ result.bestImage?.length }
    * BestImageCropped length: ' ${ result.bestImageCropped?.length }
    * livenessDiagnostic: ' ${ result.livenessDiagnostic }`;
    console.log(message);
  }

  onLaunchSelphIDProcess = async () => 
  {
    this.message        = '';
    this.selphidResult  = null;
    this.isOcrSheetOpen = false;
    await this.selphidService.launchSelphidCapture()
    .then(
      (result: SelphIDResult) => this.onSuccessSelphIDCapture(result), 
      (err: string) => this.printError(err)
    )
    .finally(() => console.info('launchSelphidCapture -> complete'));
  }

  //  Formatting output
  onSuccessSelphIDCapture = (result: SelphIDResult) => {
    console.log('Receiving selphID success event...');
    if (result !== null && result) 
    {
      switch (result.finishStatus) 
      {
        case SdkFinishStatus.Ok: // OK
          console.log(result.documentData);
          this.processSuccessResultSelphID(result); // Logging the info for debug purposes
          this.selphidResult                      = result;
          this.selphidResult!.frontDocumentImage  = this.URI_JPEG_HEADER + result.frontDocumentImage;
          this.selphidResult!.backDocumentImage   = this.URI_JPEG_HEADER + result.backDocumentImage;
          this.selphidResult!.faceImage           = (typeof result.faceImage === 'undefined' || result.faceImage === '') ? "./assets/images/image_no_available.png" : this.URI_JPEG_HEADER + result.faceImage;
          this.message                            = "";
          break;

        case SdkFinishStatus.Error: // Error
          console.log('SELPHID_ERROR:' + result);
          this.printError(result.errorType);
          break;

        default:
          console.log('Receiving selphid plugin error event...', result);
          this.printError('An error has ocurred. Read the log for more info');
          break;
      }
      this.changeDetection.detectChanges();
    }
  }

  /** Method implemented only for debug purposes */
  processSuccessResultSelphID = (result: SelphIDResult) => {
    const _message =
    `* FinishStatus: ' ${ result.finishStatus }
      * errorType: ' ${ result.errorType }
      * TokenFaceImage length: ' ${ (typeof result.tokenFaceImage === 'undefined' || result.tokenFaceImage === '') ? 0 : result.tokenFaceImage.length }
      * MatchingSidesScore: ' ${ result.matchingSidesScore }`;
    console.log(_message);
  }

  private printError(error: string)
  {
    this.message = error.replace(/_/g, ' ');
  }
  
  showOcrDataResults(): void
  {
    if ( this.selphidResult?.documentData == null ) {
      return;
    }
    this.isOcrSheetOpen = true;
    this.changeDetection.markForCheck();
  };

  closeOcrSheet(): void
  {
    this.isOcrSheetOpen = false;
    this.changeDetection.markForCheck();
  };

  onOcrSheetDismiss(): void
  {
    this.isOcrSheetOpen = false;
    this.changeDetection.markForCheck();
  };

  closeFlowsSheet = () => {
    this.isFlowsSheetOpen = false;
    this.changeDetection.markForCheck();
  };

  onSelectFlowFromSheet = (flow: FlowsResult) => {
    this.selectedFlowId = flow.id;
    this.closeFlowsSheet();
  };

  onFlowsSheetDismissed = () => {
    this.isFlowsSheetOpen = false;
    this.changeDetection.markForCheck();
  };
}