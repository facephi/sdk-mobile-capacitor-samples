import {
  SelphiCamera,
  SelphiCameraShape,
  SelphiCompressFormat,
  SelphiExtractionDuration,
  SelphiFaceLivenessMode,
  SelphiProgressMode,
} from '@facephi/sdk-selphi-capacitor';
import {
  CaptureMode,
  ExtractorSelectorMode,
  SelphIDCompressFormat,
  SelphIDDocumentType,
  SelphIDTimeout,
} from '@facephi/sdk-selphid-capacitor';

export const livenessModeOptions: { value: SelphiFaceLivenessMode | ''; label: string }[] = [
  { value: '', label: 'DEFAULT' },
  { value: SelphiFaceLivenessMode.Passive, label: 'PASSIVE' },
  { value: SelphiFaceLivenessMode.Move, label: 'MOVE' },
  { value: SelphiFaceLivenessMode.None, label: 'NONE' },
  { value: SelphiFaceLivenessMode.NoStabilized, label: 'NONE_STABILIZED' },
];

export const extractionDurationOptions: { value: SelphiExtractionDuration | ''; label: string }[] = [
  { value: '', label: 'DEFAULT' },
  { value: SelphiExtractionDuration.Short, label: 'SHORT' },
  { value: SelphiExtractionDuration.Medium, label: 'MEDIUM' },
  { value: SelphiExtractionDuration.Long, label: 'LONG' },
];

export const cameraOptions: { value: SelphiCamera; label: string }[] = [
  { value: SelphiCamera.Front, label: 'Front' },
  { value: SelphiCamera.Back, label: 'Back' },
];

export const cameraShapeOptions: { value: SelphiCameraShape | ''; label: string }[] = [
  { value: '', label: 'DEFAULT' },
  { value: SelphiCameraShape.Circular, label: 'Circular' },
  { value: SelphiCameraShape.Square, label: 'Square' },
];

export const selphiCompressFormatOptions: { value: SelphiCompressFormat | ''; label: string }[] = [
  { value: '', label: 'DEFAULT' },
  { value: SelphiCompressFormat.JPEG, label: 'JPEG' },
  { value: SelphiCompressFormat.PNG, label: 'PNG' },
];

export const progressModeOptions: { value: SelphiProgressMode | ''; label: string }[] = [
  { value: '', label: 'DEFAULT' },
  { value: SelphiProgressMode.ResetOnError, label: 'RESET_ON_ERROR' },
  { value: SelphiProgressMode.PauseAndResumeOnError, label: 'PAUSE_AND_RESUME_ON_ERROR' },
];

export const documentTypeOptions: { value: SelphIDDocumentType; label: string }[] = [
  { value: SelphIDDocumentType.IdCard, label: 'IDCARD' },
  { value: SelphIDDocumentType.Passport, label: 'PASSPORT' },
  { value: SelphIDDocumentType.DriversLicense, label: 'DRIVERSLICENSE' },
  { value: SelphIDDocumentType.ForeignCard, label: 'FOREIGNCARD' },
  { value: SelphIDDocumentType.CreditCard, label: 'CREDITCARD' },
  { value: SelphIDDocumentType.Custom, label: 'CUSTOM' },
  { value: SelphIDDocumentType.Visa, label: 'VISA' },
  { value: SelphIDDocumentType.All, label: 'ALL' },
];

export const captureModeOptions: { value: CaptureMode | ''; label: string }[] = [
  { value: '', label: 'Default' },
  { value: CaptureMode.Standard, label: 'STANDARD' },
  { value: CaptureMode.Front, label: 'FRONT' },
  { value: CaptureMode.Mrz, label: 'MRZ' },
];

export const timeoutOptions: { value: SelphIDTimeout | ''; label: string }[] = [
  { value: '', label: 'DEFAULT' },
  { value: SelphIDTimeout.Short, label: 'SHORT' },
  { value: SelphIDTimeout.Medium, label: 'MEDIUM' },
  { value: SelphIDTimeout.Long, label: 'LONG' },
  { value: SelphIDTimeout.VeryLong, label: 'VERYLONG' },
];

export const compressFormatOptions: { value: SelphIDCompressFormat | ''; label: string }[] = [
  { value: '', label: 'DEFAULT' },
  { value: SelphIDCompressFormat.JPEG, label: 'JPEG' },
  { value: SelphIDCompressFormat.PNG, label: 'PNG' },
];

export const extractorModeOptions: { value: ExtractorSelectorMode | ''; label: string }[] = [
  { value: '', label: 'Por defecto' },
  { value: ExtractorSelectorMode.InternalWeighted, label: 'INTERNAL_WEIGHTED' },
  { value: ExtractorSelectorMode.ParallelAll, label: 'PARALLEL_ALL' },
  { value: ExtractorSelectorMode.ParallelFirst, label: 'PARALLEL_FIRST' },
  { value: ExtractorSelectorMode.CustomOrder, label: 'CUSTOM_ORDER' },
];
