import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { registerPlugin } from '@capacitor/core';
import {
  SdkSelphiPlugin,
  SelphiCamera,
  SelphiCameraShape,
  SelphiCompressFormat,
  SelphiExtractionDuration,
  SelphiFaceConfiguration,
  SelphiFaceLivenessMode,
  SelphiFaceResult,
  SelphiProgressMode,
} from '@facephi/sdk-selphi-capacitor';

const SdkSelphi = registerPlugin<SdkSelphiPlugin>('SdkSelphi');

export interface SelphiSettings {
  livenessMode: SelphiFaceLivenessMode | '';
  extractionDuration: SelphiExtractionDuration | '';
  cameraPreferred: SelphiCamera;
  cameraShape: SelphiCameraShape | '';
  compressFormat: SelphiCompressFormat | '';
  progressMode: SelphiProgressMode | '';
  jpgQuality: string;
  enableGenerateTemplateRaw: boolean;
  iadEnabled?: boolean;
  qrMode?: boolean;
  showTutorial: boolean;
  showPreviousTip: boolean;
  showResultAfterCapture?: boolean;
  showDiagnostic?: boolean;
  vibrationEnabled?: boolean;
  qrCameraPreferred: SelphiCamera;
  qrTimeout: string;
  moveSuccessfulAttempts: string;
  moveFailedAttempts: string;
  bundleTimeoutMs: string;
  maxAttempts: string;
}

export function createStandardSelphiSettings(): SelphiSettings {
  return {
    livenessMode: SelphiFaceLivenessMode.Passive,
    extractionDuration: '',
    cameraPreferred: SelphiCamera.Front,
    cameraShape: '',
    compressFormat: '',
    progressMode: '',
    jpgQuality: '95',
    enableGenerateTemplateRaw: true,
    showTutorial: false,
    showPreviousTip: false,
    qrCameraPreferred: SelphiCamera.Back,
    qrTimeout: '',
    moveSuccessfulAttempts: '',
    moveFailedAttempts: '',
    bundleTimeoutMs: '',
    maxAttempts: '',
  };
}

@Injectable({
  providedIn: 'root'
})
export class SelphiService {

  settings: SelphiSettings = createStandardSelphiSettings();

  constructor(public platform: Platform) { }

  /**
   * Method that launches the plugin using the authentication with liveness passive mode.
   * @returns Promise with a JSON string.
   */
  launchSelphiAuthentication = async (): Promise<SelphiFaceResult> => {
    const config = this.toConfiguration();
    console.log('Launching selphi widget...', config);
    return SdkSelphi.startExtraction(config);
  }

  restoreSettings(): void {
    this.settings = createStandardSelphiSettings();
  }

  toConfiguration(): SelphiFaceConfiguration {
    const settings = this.settings;
    const config: SelphiFaceConfiguration = {
      cameraPreferred: settings.cameraPreferred,
      enableGenerateTemplateRaw: settings.enableGenerateTemplateRaw,
      showTutorial: settings.showTutorial,
      showPreviousTip: settings.showPreviousTip,
    };

    if (settings.livenessMode) config.livenessMode = settings.livenessMode;
    if (settings.extractionDuration) config.extractionDuration = settings.extractionDuration;
    if (settings.cameraShape) config.cameraShape = settings.cameraShape;
    if (settings.compressFormat) config.compressFormat = settings.compressFormat;
    if (settings.progressMode) config.progressMode = settings.progressMode;

    const jpgQuality = this.parseNumber(settings.jpgQuality);
    if (jpgQuality != null) config.jpgQuality = jpgQuality;

    this.assignBool(config, 'iadEnabled', settings.iadEnabled);
    this.assignBool(config, 'showResultAfterCapture', settings.showResultAfterCapture);
    this.assignBool(config, 'showDiagnostic', settings.showDiagnostic);
    this.assignBool(config, 'vibrationEnabled', settings.vibrationEnabled);

    if (settings.qrMode) {
      config.qrMode = true;
      config.qrCameraPreferred = settings.qrCameraPreferred;
      const qrTimeout = this.parseNumber(settings.qrTimeout);
      if (qrTimeout != null) config.qrTimeout = qrTimeout;
    }

    if (settings.livenessMode === SelphiFaceLivenessMode.Move) {
      this.assignNumber(config, 'moveSuccessfulAttempts', settings.moveSuccessfulAttempts);
      this.assignNumber(config, 'moveFailedAttempts', settings.moveFailedAttempts);
      this.assignNumber(config, 'bundleTimeoutMs', settings.bundleTimeoutMs);
      this.assignNumber(config, 'maxAttempts', settings.maxAttempts);
    }

    return config;
  }

  setSelphiFlow = async (): Promise<SelphiFaceResult> => {
    console.log('Launching setSelphiFlow...');

    return SdkSelphi.setSelphiFlow();
  }

  private assignBool(
    config: SelphiFaceConfiguration,
    key: 'iadEnabled' | 'showResultAfterCapture' | 'showDiagnostic' | 'vibrationEnabled',
    value: boolean | undefined
  ): void {
    if (typeof value === 'boolean') config[key] = value;
  }

  private assignNumber(
    config: SelphiFaceConfiguration,
    key: 'moveSuccessfulAttempts' | 'moveFailedAttempts' | 'bundleTimeoutMs' | 'maxAttempts',
    value: string
  ): void {
    const parsed = this.parseNumber(value);
    if (parsed != null) config[key] = parsed;
  }

  private parseNumber(value: string): number | undefined {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
}
