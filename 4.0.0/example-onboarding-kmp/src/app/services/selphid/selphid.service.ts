import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { registerPlugin } from '@capacitor/core';

import {
  CaptureMode,
  ExtractorSelectorMode,
  SdkSelphidPlugin,
  SelphIDCompressFormat,
  SelphIDConfiguration,
  SelphIDDocumentType,
  SelphIDResult,
  SelphIDTimeout,
} from '@facephi/sdk-selphid-capacitor';

const SdkSelphid = registerPlugin<SdkSelphidPlugin>('SdkSelphid');

export interface SelphidSettings {
  documentTypes: SelphIDDocumentType[];
  enabledDocumentTypes: SelphIDDocumentType[];
  enabledCountries: string;
  captureMode: CaptureMode | '';
  timeout: SelphIDTimeout | '';
  showTutorial: boolean;
  showPreviousTip?: boolean;
  showResultAfterCapture: boolean;
  showDiagnostic?: boolean;
  vibrationEnabled?: boolean;
  generateRawImages: boolean;
  showDocumentSelector?: boolean;
  compressFormat: SelphIDCompressFormat | '';
  jpgQuality: string;
  mode: ExtractorSelectorMode | '';
  perAttemptTimeoutMs: string;
  maxAttempts: string;
}

export function createStandardSelphidSettings(): SelphidSettings {
  return {
    documentTypes: [SelphIDDocumentType.IdCard],
    enabledDocumentTypes: [],
    enabledCountries: '',
    captureMode: '',
    timeout: '',
    showTutorial: false,
    showResultAfterCapture: true,
    generateRawImages: true,
    compressFormat: '',
    jpgQuality: '95',
    mode: '',
    perAttemptTimeoutMs: '',
    maxAttempts: '',
  };
}

@Injectable({
  providedIn: 'root'
})
export class SelphidService
{
  settings: SelphidSettings = createStandardSelphidSettings();

  constructor(public platform: Platform) { }

  /**
   * Method that launches the SelphID plugin with Search Mode.
   * @returns Promise with a JSON string.
   */
  launchSelphidCapture = async (): Promise<SelphIDResult> =>
  {
    const widgetConfig = this.toConfiguration();
    console.log('Launching selphID widget...', widgetConfig);
    return SdkSelphid.startCapture(widgetConfig);
  }

  restoreSettings(): void {
    this.settings = createStandardSelphidSettings();
  }

  toConfiguration(): SelphIDConfiguration {
    const settings = this.settings;
    const documentTypes = settings.documentTypes.length
      ? [...settings.documentTypes]
      : [SelphIDDocumentType.IdCard];
    const config: SelphIDConfiguration = {
      documentTypes,
      defaultDocumentType: documentTypes[0],
      showResultAfterCapture: settings.showResultAfterCapture,
      showTutorial: settings.showTutorial,
      generateRawImages: settings.generateRawImages,
    };

    this.assignBool(config, 'showPreviousTip', settings.showPreviousTip);
    this.assignBool(config, 'showDiagnostic', settings.showDiagnostic);
    this.assignBool(config, 'vibrationEnabled', settings.vibrationEnabled);
    this.assignBool(config, 'showDocumentSelector', settings.showDocumentSelector);

    if (settings.captureMode) config.captureMode = settings.captureMode;
    if (settings.timeout) config.timeout = settings.timeout;
    if (settings.compressFormat) config.compressFormat = settings.compressFormat;
    if (settings.mode) config.mode = settings.mode;

    const jpgQuality = this.parseNumber(settings.jpgQuality);
    const perAttemptTimeoutMs = this.parseNumber(settings.perAttemptTimeoutMs);
    const maxAttempts = this.parseNumber(settings.maxAttempts);
    if (jpgQuality != null) config.jpgQuality = jpgQuality;
    if (perAttemptTimeoutMs != null) config.perAttemptTimeoutMs = perAttemptTimeoutMs;
    if (maxAttempts != null) config.maxAttempts = maxAttempts;

    if (settings.showDocumentSelector) {
      if (settings.enabledDocumentTypes.length) {
        config.enabledDocumentTypes = [...settings.enabledDocumentTypes];
      }
      const countries = settings.enabledCountries
        .split(',')
        .map((item) => item.trim().toUpperCase())
        .filter((item) => item.length > 0);
      if (countries.length) config.enabledCountries = countries;
    }

    return config;
  }

  setSelphidFlow = async (): Promise<SelphIDResult> => {
    console.log('Launching setSelphidFlow...');

    return SdkSelphid.setSelphidFlow();
  }

  private assignBool(
    config: SelphIDConfiguration,
    key: 'showPreviousTip' | 'showDiagnostic' | 'vibrationEnabled' | 'showDocumentSelector',
    value: boolean | undefined
  ): void {
    if (typeof value === 'boolean') config[key] = value;
  }

  private parseNumber(value: string): number | undefined {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
}
