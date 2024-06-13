import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NfcService } from '../services/nfc/nfc.service';
import { CoreService } from '../services/core/core.service';
import { SdkFinishStatus, SdkErrorType, CoreResult, SdkCorePlugin } from '@facephi/sdk-core-capacitor';
import { fphi_str_activity_result_error, fphi_str_camera_error, fphi_str_camera_permission_denied, fphi_str_component_controller_application_error, fphi_str_component_controller_error, fphi_str_extractor_license_error, fphi_str_generic_bad_extractor_conf, fphi_str_generic_control_not_initialized, fphi_str_generic_extraction_license, fphi_str_generic_unexpected_captured, fphi_str_hardware_error, fphi_str_init_proccess_error, fphi_str_init_session_error, fphi_str_initialization_error, fphi_str_license_checker_error_invalid_component_license, fphi_str_license_checker_error_invalid_license, fphi_str_license_string_error, fphi_str_licensing_error_api_key_forbidden, fphi_str_licensing_error_app_id_invalid, fphi_str_licensing_error_license_not_found, fphi_str_licensing_error_package_name, fphi_str_network_connection, fphi_str_nfc_error, fphi_str_nfc_error_data, fphi_str_nfc_error_disabled, fphi_str_nfc_error_illegal_argument, fphi_str_nfc_error_not_supported, fphi_str_nfc_error_tag_lost, fphi_str_no_data_error, fphi_str_no_operation_created_error, fphi_str_permission_denied, fphi_str_phacturas_capture_error, fphi_str_phingers_autofocus_failure, fphi_str_phingers_camera_failure, fphi_str_phingers_capture_failure, fphi_str_phingers_configuration_failure, fphi_str_phingers_fingerprint_capture_failure, fphi_str_phingers_fingerprint_template_io_error, fphi_str_phingers_licensing_failure, fphi_str_phingers_liveness_failure, fphi_str_phingers_no_detected, fphi_str_phingers_unique_userid_not_specified, fphi_str_qr_capture_error, fphi_str_qr_generation_error, fphi_str_resourses_not_found, fphi_str_sdk_init_flow, fphi_str_sdk_not_initialized, fphi_str_settings_permission_denied, fphi_str_stopped_manually, fphi_str_timeout, fphi_str_token_error, fphi_str_tracking_error, fphi_str_unknown_error, fphi_str_video_error } from '../constants';
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
    private loadingCtrl: LoadingController,
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

  onLaunchFlow = async () => 
  {
    this.message = '';
      
    /* se agrega el nuevo método que escucha los eventos 
    this.listener = SdkCore.addListener('core.flow', (response: any) => {
      console.log('core.flow was fired');
      console.log("core.flow:", response);
    });*/

    await this.coreService.initFlow()
    .then(async (result: CoreResult) => 
    {
      if (result.finishStatus == SdkFinishStatus.Ok)
      {
        await this.nfcService.setNfcFlow()
          .then((res: NfcResult) => console.log("setNfcFlow res", res))
          .catch((err) => console.log("setNfcFlow err", err));

        await this.coreService.startFlow()
          .then((res: CoreResult) => console.log("startFlow res", res))
          .catch((err) => console.log("startFlow err", err));
      }
    }, 
    (err: any) => console.log(err));
  }

  onLaunchTokenize = async () => {
    this.message = '';
    await this.coreService.tokenize()
    .then((result: CoreResult) => console.log(result), (err: any) => console.log(err));
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

  onLaunchNfcProcess = async () => {
    this.message = '';
    await this.nfcService.launchNfc()
    .then((result: NfcResult) => console.log(result), (err: string) => console.log(err));
  }

  onLaunchInitOperationProcess = async () => {
    this.message = '';
    await this.coreService.initOperation()
    .then((result: CoreResult) => console.log(result), (err: string) => console.log(err));
  }

  private printError(data: any)
  {
    if (data['errorType'] === SdkErrorType.InitFlow) // Unknown Error
    {
      this.message = fphi_str_sdk_init_flow;
    }
    else if (data['errorType'] === SdkErrorType.UnknownError) // Unknown Error
    {
      this.message = fphi_str_unknown_error;
    }
    else if (data['errorType'] === SdkErrorType.CameraPermissionDenied) // Camera Permission Denied
    {
      this.message = fphi_str_camera_permission_denied;
    }
    else if (data['errorType'] === SdkErrorType.SettingsPermissionDenied) // Settings Permission Denied
    {
      this.message = fphi_str_settings_permission_denied;
    }
    else if (data['errorType'] === SdkErrorType.HardwareError) // Hardware error
    {
      this.message = fphi_str_hardware_error;
    }
    else if (data['errorType'] === SdkErrorType.ExtractionLicenseError)
    {
      this.message = fphi_str_generic_extraction_license;
    }
    else if (data['errorType'] === SdkErrorType.UnexpectedCaptureError)
    {
      this.message = fphi_str_generic_unexpected_captured;
    }
    else if (data['errorType'] === SdkErrorType.ControlNotInitializedError)
    {
      this.message = fphi_str_generic_control_not_initialized;
    }
    else if (data['errorType'] === SdkErrorType.BadExtractorConfiguration)
    {
      this.message = fphi_str_generic_bad_extractor_conf;
    }
    else if (data['errorType'] === SdkErrorType.CancelByUser)
    {
      this.message = fphi_str_stopped_manually;
    }
    else if (data['errorType'] === SdkErrorType.Timeout)
    {
      this.message = fphi_str_timeout;
    }
    else if (data['errorType'] === SdkErrorType.InitProccessError)
    {
      this.message = fphi_str_init_proccess_error;
    }
    else if (data['errorType'] === SdkErrorType.NfcError)
    {
      this.message = fphi_str_nfc_error;
    }
    else if (data['errorType'] === SdkErrorType.NetworkConnection)
    {
      this.message = fphi_str_network_connection;
    }
    else if (data['errorType'] === SdkErrorType.TokenError)
    {
      this.message = fphi_str_token_error;
    }
    else if (data['errorType'] === SdkErrorType.InitSessionError)
    {
      this.message = fphi_str_init_session_error;
    }
    else if (data['errorType'] === SdkErrorType.ComponentControllerError)
    {
      this.message = fphi_str_component_controller_error;
    }
    else if (data['errorType'] === SdkErrorType.LicenseCheckerErrorInvalidLicense)
    {
      this.message = fphi_str_license_checker_error_invalid_license;
    }
    else if (data['errorType'] === SdkErrorType.LicensingErrorAppIdInvalid)
    {
      this.message = fphi_str_licensing_error_app_id_invalid;
    }
    else if (data['errorType'] === SdkErrorType.LicensingErrorApiKeyForbidden)
    {
      this.message = fphi_str_licensing_error_api_key_forbidden;
    }
    else if (data['errorType'] === SdkErrorType.LicensingErrorLicenseNotFound)
    {
      this.message = fphi_str_licensing_error_license_not_found;
    }
    else if (data['errorType'] === SdkErrorType.LicensingErrorPackageName)
    {
      this.message = fphi_str_licensing_error_package_name;
    }
    else if (data['errorType'] === SdkErrorType.LicenseCheckerErrorInvalidComponentLicense)
    {
      this.message = fphi_str_license_checker_error_invalid_component_license;
    }
    else if (data['errorType'] === SdkErrorType.ComponentControllerApplicationError)
    {
      this.message = fphi_str_component_controller_application_error;
    }
    else if (data['errorType'] === SdkErrorType.NoOperationCreatedError)
    {
      this.message = fphi_str_no_operation_created_error;
    }
    else if (data['errorType'] === SdkErrorType.LicenseStringError)
    {
      this.message = fphi_str_license_string_error;
    }
    else if (data['errorType'] === SdkErrorType.SdkNotInitialized)
    {
      this.message = fphi_str_sdk_not_initialized;
    }
    else if (data['errorType'] === SdkErrorType.TrackingError)
    {
      this.message = fphi_str_tracking_error;
    }
    else if (data['errorType'] === SdkErrorType.ActivityResultError)
    {
      this.message = fphi_str_activity_result_error;
    }
    else if (data['errorType'] === SdkErrorType.ExtractorLicenseError)
    {
      this.message = fphi_str_extractor_license_error;
    }
    else if (data['errorType'] === SdkErrorType.InitializationError)
    {
      this.message = fphi_str_initialization_error;
    }
    else if (data['errorType'] === SdkErrorType.ResourcesNotFound)
    {
      this.message = fphi_str_resourses_not_found;
    }
    else if (data['errorType'] === SdkErrorType.NfcErrorDisabled)
    {
      this.message = fphi_str_nfc_error_disabled;
    }
    else if (data['errorType'] === SdkErrorType.NfcErrorData)
    {
        this.message = fphi_str_nfc_error_data;
    }
    else if (data['errorType'] === SdkErrorType.NfcErrorNotSupported)
    {
      this.message = fphi_str_nfc_error_not_supported;
    }
    else if (data['errorType'] === SdkErrorType.NfcErrorTagLost)
    {
      this.message = fphi_str_nfc_error_tag_lost;
    }
    else if (data['errorType'] === SdkErrorType.NfcErrorIllegalArgument)
    {
      this.message = fphi_str_nfc_error_illegal_argument;
    }
    else if (data['errorType'] === SdkErrorType.QrCaptureError)
    {
      this.message = fphi_str_qr_capture_error;
    }
    else if (data['errorType'] === SdkErrorType.CameraError)
    {
      this.message = fphi_str_camera_error;
    }
    else if (data['errorType'] === SdkErrorType.PhacturasCaptureError)
    {
      this.message = fphi_str_phacturas_capture_error;
    }
    else if (data['errorType'] === SdkErrorType.QrGenerationError)
    {
      this.message = fphi_str_qr_generation_error;
    }
    else if (data['errorType'] === SdkErrorType.NoDataError)
    {
      this.message = fphi_str_no_data_error;
    }
    else if (data['errorType'] === SdkErrorType.VideoError)
    {
      this.message = fphi_str_video_error;
    }
    else if (data['errorType'] === SdkErrorType.PermissionDenied)
    {
      this.message = fphi_str_permission_denied;
    }
    else if (data['errorType'] === SdkErrorType.PhingersAutofocusFailure)
    {
      this.message = fphi_str_phingers_autofocus_failure;
    }
    else if (data['errorType'] === SdkErrorType.PhingersCaptureFailure)
    {
      this.message = fphi_str_phingers_capture_failure;
    }
    else if (data['errorType'] === SdkErrorType.PhingersCameraFailure)
    {
      this.message = fphi_str_phingers_camera_failure;
    }
    else if (data['errorType'] === SdkErrorType.PhingersFingerprintTemplateIoError)
    {
      this.message = fphi_str_phingers_fingerprint_template_io_error;
    }
    else if (data['errorType'] === SdkErrorType.PhingersConfigurationFailure)
    {
      this.message = fphi_str_phingers_configuration_failure;
    }
    else if (data['errorType'] === SdkErrorType.PhingersFingerprintCaptureFailure)
    {
      this.message = fphi_str_phingers_fingerprint_capture_failure;
    }
    else if (data['errorType'] === SdkErrorType.PhingersLicensingFailure)
    {
      this.message = fphi_str_phingers_licensing_failure;
    }
    else if (data['errorType'] === SdkErrorType.PhingersLivenessFailure)
    {
      this.message = fphi_str_phingers_liveness_failure;
    }
    else if (data['errorType'] === SdkErrorType.PhingersNoFingersDetected)
    {
      this.message = fphi_str_phingers_no_detected;
    }
    else if (data['errorType'] === SdkErrorType.PhingersUniqueUserIdNotSpecified)
    {
      this.message = fphi_str_phingers_unique_userid_not_specified;
    }
    else
    {
      this.message = fphi_str_unknown_error;
    }
  }
}