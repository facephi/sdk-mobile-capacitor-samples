import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SelphiService } from '../services/selphi-face/selphi.service';
import { SelphidService } from '../services/selphid/selphid.service';
import { CoreService } from '../services/core/core.service';
import { SelphiFaceResult } from '@facephi/sdk-selphi-capacitor';
import { SelphIDDocumentType, SelphIDResult } from '@facephi/sdk-selphid-capacitor';
import {
  cameraOptions,
  cameraShapeOptions,
  captureModeOptions,
  compressFormatOptions,
  documentTypeOptions,
  extractionDurationOptions,
  extractorModeOptions,
  livenessModeOptions,
  progressModeOptions,
  selphiCompressFormatOptions,
  timeoutOptions,
} from './home.constants.page';
import { SdkFinishStatus, CoreResult, SdkCorePlugin } from '@facephi/sdk-core-capacitor';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
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
  isSelphidConfigOpen: boolean            = false;
  isSelphiConfigOpen: boolean             = false;
  
  readonly livenessModeOptions = livenessModeOptions;
  readonly extractionDurationOptions = extractionDurationOptions;
  readonly cameraOptions = cameraOptions;
  readonly cameraShapeOptions = cameraShapeOptions;
  readonly selphiCompressFormatOptions = selphiCompressFormatOptions;
  readonly progressModeOptions = progressModeOptions;
  readonly documentTypeOptions = documentTypeOptions;
  readonly captureModeOptions = captureModeOptions;
  readonly timeoutOptions = timeoutOptions;
  readonly compressFormatOptions = compressFormatOptions;
  readonly extractorModeOptions = extractorModeOptions;
  
  private selphiPressTimer: ReturnType<typeof setTimeout> | null = null;
  private selphiPressOrigin: { x: number; y: number } | null = null;
  private selphiLongPressFired = false;
  private selphidPressTimer: ReturnType<typeof setTimeout> | null = null;
  private selphidPressOrigin: { x: number; y: number } | null = null;
  private selphidLongPressFired = false;

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
    this.apiRest            = apiRest;
    this.selphiFaceService  = selphiService;
    this.selphidService     = selphidService;
    this.coreService        = coreService;
  }

  ngOnInit(): void 
  {
    let dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    try {
      const stored = localStorage.getItem(APP_DARK_MODE_STORAGE_KEY);
      if (stored === '1') dark = true;
      if (stored === '0') dark = false;
    } catch {
      /* modo privado u otro bloqueo */
    }
    this.applyTheme(dark, false);
  }

  toggleTheme = (): void => {
    this.applyTheme(!this.isDarkMode, true);
  };

  get hasResults(): boolean 
  {
    const documentData = this.selphidResult?.documentData;
    return this.filledImage(this.selphiResult?.bestImageCropped) || this.filledImage(this.selphidResult?.frontDocumentImage) || this.filledImage(this.selphidResult?.backDocumentImage) || this.filledImage(this.selphidResult?.faceImage) || (!!documentData && Object.keys(documentData).length > 0);
  }

  get extraDataEnabled(): boolean 
  {
    const token = this.selphidResult?.tokenFaceImage?.trim() ?? '';
    return this.filledImage(this.selphiResult?.bestImageCropped) && token.length > 0;
  }

  get selphidDone(): boolean 
  {
    return this.filledImage(this.selphidResult?.frontDocumentImage) || this.filledImage(this.selphidResult?.backDocumentImage);
  }

  formatDocumentValue(value: unknown): string 
  {
    if (value == null) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  private applyTheme(dark: boolean, persist: boolean): void 
  {
    document.body.classList.toggle('app-dark-mode', dark);
    document.documentElement.style.setProperty('color-scheme', dark ? 'dark' : 'light');
    if (persist) {
      try {
        localStorage.setItem(APP_DARK_MODE_STORAGE_KEY, dark ? '1' : '0');
      } catch {
        /* modo privado u otro bloqueo */
      }
    }
    this.isDarkMode = dark;
    this.changeDetection.markForCheck();
  }

  private filledImage(value?: string | null): boolean 
  {
    if (!value) return false;
    const trimmed = value.trim();
    if (!trimmed || trimmed === this.URI_JPEG_HEADER) return false;
    if (trimmed.endsWith('undefined') || trimmed.endsWith('null')) return false;
    if (trimmed.includes('image_no_available')) return false;
    return true;
  }

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
          break;

        case SdkFinishStatus.Error:
          this.printError(result.errorType);
          break;
      }
    })
    .catch((err: any) => console.log("Error launchGetFlowIntegrationData:", err))
    .finally(() => {
      console.log("End launchGetFlowIntegrationData...");
      this.changeDetection.markForCheck();
    })
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

  onInitSession = async () => 
  {
    this.message = '';
    await this.coreService.initSession()
    .then(
      (result: CoreResult) => console.log(result), 
      (err: any) => this.printError(err)
    )
    .finally(() => { 
      console.info('onInitSession -> complete');
      this.changeDetection.detectChanges();
    });
  }

  onCloseSession = async () => 
  {
    this.message = '';
    await this.coreService.closeSession()
    .then(
      (result: CoreResult) => 
      {
        console.log(result)
      },
      (err: any) => this.printError(err)
    ).finally(
      () => { 
        console.info('onCloseSession -> complete');
        this.changeDetection.detectChanges();
      }
    );
  }

  onGetExtraData = async () => 
  {
    this.message  = '';
    let loading   = await this.loadingCtrl.create({ message: 'Requesting ...' });

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

  onLaunchInitOperationProcess = async () => 
  {
    this.message = '';
    await this.coreService.initOperation()
    .then(
      (result: CoreResult) => console.log(result),
      (err: string) => this.printError(err)
    ).finally(
      () => { 
        console.info('onLaunchInitOperationProcess -> complete');
        this.changeDetection.detectChanges();
      }
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
    ).finally(
      () => { 
        console.info('launchSelphiAuthentication -> complete');
        this.changeDetection.detectChanges();
      }
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
          console.log(result);
          this.message      = "";
          this.selphiResult = result;
          if (result.bestImageCropped) {
            this.selphiResult!.bestImageCropped = this.URI_JPEG_HEADER + result.bestImageCropped;
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
    }
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
    .finally(
      () => {
        console.info('launchSelphidCapture -> complete');
        this.changeDetection.detectChanges();
      }
    );
  }

  //  Formatting output
  onSuccessSelphIDCapture = (result: SelphIDResult) => {
    console.log('Receiving selphID success event...');
    if (result !== null && result) 
    {
      switch (result.finishStatus) 
      {
        case SdkFinishStatus.Ok: // OK
          console.log(result);
          this.message        = "";
          this.selphidResult  = result;
          if (result.frontDocumentImage) {
            this.selphidResult!.frontDocumentImage  = this.URI_JPEG_HEADER + result.frontDocumentImage;
          }
          if (result.backDocumentImage) {
            this.selphidResult!.backDocumentImage  = this.URI_JPEG_HEADER + result.backDocumentImage;
          }
          if (result.faceImage) {
            this.selphidResult!.faceImage = this.URI_JPEG_HEADER + result.faceImage;
          }
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
    }
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

  onSelphiPointerDown(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement;
    try {
      target.setPointerCapture(event.pointerId);
    } catch {
      /* el puntero ya no está activo */
    }
    this.selphiLongPressFired = false;
    this.selphiPressOrigin = { x: event.clientX, y: event.clientY };
    this.clearSelphiPressTimer();
    this.selphiPressTimer = setTimeout(() => {
      this.selphiPressTimer = null;
      this.selphiLongPressFired = true;
      this.openSelphiConfig();
    }, 450);
  }

  onSelphiPointerMove(event: PointerEvent): void {
    if (!this.selphiPressOrigin || !this.selphiPressTimer) return;
    const dx = event.clientX - this.selphiPressOrigin.x;
    const dy = event.clientY - this.selphiPressOrigin.y;
    if (dx * dx + dy * dy > 144) this.clearSelphiPressTimer();
  }

  onSelphiPointerUp(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture?.(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
    this.clearSelphiPressTimer();
  }

  onSelphiClick(event: Event): void {
    if (this.selphiLongPressFired) {
      event.preventDefault();
      event.stopPropagation();
      this.selphiLongPressFired = false;
      return;
    }
    this.onLaunchSelphiProcess();
  }

  openSelphiConfig(): void {
    void Haptics.impact({ style: ImpactStyle.Medium }).catch(() => undefined);
    this.isSelphiConfigOpen = true;
    this.changeDetection.markForCheck();
  }

  onSelphiConfigDismiss(): void {
    this.isSelphiConfigOpen = false;
    this.changeDetection.markForCheck();
  }

  toggleSelphiFlag(key: 'enableGenerateTemplateRaw' | 'iadEnabled' | 'qrMode' | 'showTutorial' | 'showPreviousTip' | 'showResultAfterCapture' | 'showDiagnostic' | 'vibrationEnabled'): void {
    this.selphiFaceService.settings[key] = !this.selphiFaceService.settings[key];
    this.changeDetection.markForCheck();
  }

  onSelphiDigits(key: 'jpgQuality' | 'qrTimeout' | 'moveSuccessfulAttempts' | 'moveFailedAttempts' | 'bundleTimeoutMs' | 'maxAttempts', event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    input.value = digits;
    this.selphiFaceService.settings[key] = digits;
  }

  restoreSelphiSettings(): void {
    this.selphiFaceService.restoreSettings();
    this.changeDetection.markForCheck();
  }

  private clearSelphiPressTimer(): void {
    if (this.selphiPressTimer) {
      clearTimeout(this.selphiPressTimer);
      this.selphiPressTimer = null;
    }
    this.selphiPressOrigin = null;
  }

  onSelphidPointerDown(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement;
    try {
      target.setPointerCapture(event.pointerId);
    } catch {
      /* el puntero ya no está activo */
    }
    this.selphidLongPressFired = false;
    this.selphidPressOrigin = { x: event.clientX, y: event.clientY };
    this.clearSelphidPressTimer();
    this.selphidPressTimer = setTimeout(() => {
      this.selphidPressTimer = null;
      this.selphidLongPressFired = true;
      this.openSelphidConfig();
    }, 450);
  }

  onSelphidPointerMove(event: PointerEvent): void {
    if (!this.selphidPressOrigin || !this.selphidPressTimer) return;
    const dx = event.clientX - this.selphidPressOrigin.x;
    const dy = event.clientY - this.selphidPressOrigin.y;
    if (dx * dx + dy * dy > 144) this.clearSelphidPressTimer();
  }

  onSelphidPointerUp(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture?.(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
    this.clearSelphidPressTimer();
  }

  onSelphidClick(event: Event): void {
    if (this.selphidLongPressFired) {
      event.preventDefault();
      event.stopPropagation();
      this.selphidLongPressFired = false;
      return;
    }
    this.onLaunchSelphIDProcess();
  }

  openSelphidConfig(): void {
    void Haptics.impact({ style: ImpactStyle.Medium }).catch(() => undefined);
    this.isSelphidConfigOpen = true;
    this.changeDetection.markForCheck();
  }

  onSelphidConfigDismiss(): void {
    this.isSelphidConfigOpen = false;
    this.changeDetection.markForCheck();
  }

  isDocumentTypeSelected(type: SelphIDDocumentType): boolean {
    return this.selphidService.settings.documentTypes.includes(type);
  }

  toggleDocumentType(type: SelphIDDocumentType): void {
    const selected = this.selphidService.settings.documentTypes;
    if (selected.includes(type)) {
      if (selected.length === 1) return;
      this.selphidService.settings.documentTypes = selected.filter((item) => item !== type);
    } else {
      this.selphidService.settings.documentTypes = [...selected, type];
    }
    this.changeDetection.markForCheck();
  }

  isEnabledDocumentTypeSelected(type: SelphIDDocumentType): boolean {
    return this.selphidService.settings.enabledDocumentTypes.includes(type);
  }

  toggleEnabledDocumentType(type: SelphIDDocumentType): void {
    const selected = this.selphidService.settings.enabledDocumentTypes;
    this.selphidService.settings.enabledDocumentTypes = selected.includes(type)
      ? selected.filter((item) => item !== type)
      : [...selected, type];
    this.changeDetection.markForCheck();
  }

  toggleSelphidFlag(key: 'showTutorial' | 'showPreviousTip' | 'showResultAfterCapture' | 'showDiagnostic' | 'vibrationEnabled' | 'generateRawImages' | 'showDocumentSelector'): void {
    this.selphidService.settings[key] = !this.selphidService.settings[key];
    this.changeDetection.markForCheck();
  }

  onSelphidDigits(key: 'jpgQuality' | 'perAttemptTimeoutMs' | 'maxAttempts', event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    input.value = digits;
    this.selphidService.settings[key] = digits;
  }

  onSelphidCountries(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upper = input.value.toUpperCase();
    if (input.value !== upper) input.value = upper;
    this.selphidService.settings.enabledCountries = upper;
  }

  restoreSelphidSettings(): void {
    this.selphidService.restoreSettings();
    this.changeDetection.markForCheck();
  }

  private clearSelphidPressTimer(): void {
    if (this.selphidPressTimer) {
      clearTimeout(this.selphidPressTimer);
      this.selphidPressTimer = null;
    }
    this.selphidPressOrigin = null;
  }
}