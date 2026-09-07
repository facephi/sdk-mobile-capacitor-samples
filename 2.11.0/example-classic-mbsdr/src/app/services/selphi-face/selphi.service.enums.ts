/**
 * @typeParam SelphiPluginFinishStatus The generic diagnostic that the plugin returns.
 * You may also use the template tag.
 */
export enum SelphiPluginFinishStatus {
    Ok = 1,
    Error = 2,
    CancelByUser = 3,
    Timeout = 4
}

/**
 * @typeParam SelphiPluginErrorType The type of exception due to an issue during the plugin call.
 * You may also use the template tag.
 */
export enum SelphiPluginErrorType {
    UnknownError = 1,
    NoError = 2,
    CameraPermissionDenied = 3,
    SettingsPermissionDenied = 4,
    HardwareError = 5,
    ExtractionLicenseError = 6,
    ControlNotInitializedError = 7,
    BadExtractorConfiguration = 8
}

/**
 * @typeParam SelphiPassiveDiagnostic The diagnostic code for the liveness passive process. This diagnostic is returned after the web service request.
 * You may also use the template tag.
 */
export enum SelphiPassiveDiagnostic {
    None = 0,
    Spoof = 1,
    Uncertain = 2,
    Live = 3,
    NoneBecauseBadQuality = 4,
    NoneBecauseFaceTooClose = 5,
    NoneBecauseFaceNotFound = 6,
    NoneBecauseFaceTooSmall = 7,
    NoneBecauseAngleTooLarge = 8,
    NoneBecauseImageDataError = 9,
    NoneBecauseInternalError = 10,
    NoneBecauseImagePreprocessError = 11,
    NoneBecauseTooManyFaces = 12
}