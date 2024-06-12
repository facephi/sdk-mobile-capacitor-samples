import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CoreService } from '../services/core/core.service';
import { SdkErrorType, CoreResult } from '@facephi/sdk-core-capacitor';
import { fphi_str_camera_permission_denied, fphi_str_component_controller_error, fphi_str_generic_bad_extractor_conf, fphi_str_generic_control_not_initialized, fphi_str_generic_extraction_license, fphi_str_generic_unexpected_captured, fphi_str_hardware_error, fphi_str_init_proccess_error, fphi_str_init_session_error, fphi_str_network_connection, fphi_str_nfc_error, fphi_str_settings_permission_denied, fphi_str_stopped_manually, fphi_str_timeout, fphi_str_token_error, fphi_str_unknown_error } from '../constants';
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

  message = '';
  isListExpanded = false;
  showError = false;

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
    .then((result: CoreResult) => console.log(result), (err: any) => console.log(err));
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
    .then((result: CoreResult) => console.log(result), (err: string) => console.log(err));
  }

  private printError(result: number)
  {
    if (result === SdkErrorType.UnknownError) // Unknown Error
    {
      this.message = fphi_str_unknown_error;
    }
    else if (result === SdkErrorType.CameraPermissionError) // Camera Permission Denied
    {
      this.message = fphi_str_camera_permission_denied;
    }
    else if (result === SdkErrorType.SettingsPermissionError) // Settings Permission Denied
    {
      this.message = fphi_str_settings_permission_denied;
    }
    else if (result === SdkErrorType.HardwareError) // Hardware error
    {
      this.message = fphi_str_hardware_error;
    }
    else if (result === SdkErrorType.ExtractionLicenseError) {
      this.message = fphi_str_generic_extraction_license;
    }
    else if (result === SdkErrorType.UnexpectedCaptureError) {
      this.message = fphi_str_generic_unexpected_captured;
    }
    else if (result === SdkErrorType.ControlNotInitializedError) {
      this.message = fphi_str_generic_control_not_initialized;
    }
    else if (result === SdkErrorType.BadExtractorConfigurationError) {
      this.message = fphi_str_generic_bad_extractor_conf;
    }
    else if (result === SdkErrorType.OperationCancelByUser) {
      this.message = fphi_str_stopped_manually;
    }
    else if (result === SdkErrorType.Timeout) {
      this.message = fphi_str_timeout;
    }
    else if (result === SdkErrorType.InitProccessError) {
      this.message = fphi_str_init_proccess_error;
    }
    else if (result === SdkErrorType.NfcError) {
      this.message = fphi_str_nfc_error;
    }
    else if (result === SdkErrorType.NetworkConnectionError) {
      this.message = fphi_str_network_connection;
    }
    else if (result === SdkErrorType.TokenError) {
      this.message = fphi_str_token_error;
    }
    else if (result === SdkErrorType.InitSessionError) {
      this.message = fphi_str_init_session_error;
    }
    else if (result === SdkErrorType.ComponentControllerError) {
      this.message = fphi_str_component_controller_error;
    }
    else
    {
      this.message = fphi_str_unknown_error;
    }
  }
}