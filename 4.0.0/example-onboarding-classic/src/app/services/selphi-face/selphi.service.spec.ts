import { TestBed } from '@angular/core/testing';
import { SelphiService } from './selphi.service';
import { SdkSelphiPlugin, SelphiCamera, SelphiCompressFormat, SelphiExtractionDuration, SelphiFaceConfiguration, SelphiFaceLivenessMode, SelphiFaceResult } from '@facephi/sdk-selphi-capacitor';
import { Capacitor, registerPlugin } from '@capacitor/core';

describe('SelphiService', () => {
  const SdkSelphi = registerPlugin<SdkSelphiPlugin>("SdkSelphi");
  let service: SelphiService;
  let selphi: SdkSelphiPlugin;

  beforeEach(() => {
    TestBed.configureTestingModule({}); //CREATES A FAKE MODULE(VERY IMPORTANT)
    service = TestBed.inject(SelphiService);
    //selphi = TestBed.inject(registerPlugin<SdkSelphiPlugin>);
  });

  it('Should validate SelphiService be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should validate Method startExtraction exists', async () => {
    let config: SelphiFaceConfiguration = {
      debug: false,
      livenessMode: SelphiFaceLivenessMode.Passive,
      resourcesPath: "",
      enableGenerateTemplateRaw: true
    };

    //(SdkSelphi.startExtraction(config) as any).and.returnValue(Promise.resolve({ value: 'Jason' }));
    //(selphi.startExtraction as any).withArgs({ key: 'lastName' }).and.returnValue(Promise.resolve({ value: 'Jones' }));

    //fixture.detectChanges();
    //await fixture.whenRenderingDone();
    //expect(component.firstName).toEqual('Jason');
    //expect(component.lastName).toEqual('Jones');

    //spyOn(selphi, "startExtraction").and.callFake().and.returnValue(Promise.resolve({errorType: "", finishStatus: 1}))
    //spyOn(selphi, "startExtraction").and.callThrough().and.returnValue(Promise.resolve({errorType: "", finishStatus: 1}))
    //spyOn(service, "launchSelphiAuthentication").and.callFake(config).and.returnValue(Promise.resolve({errorType: "", finishStatus: 1}))
    //spyOn(service, "launchSelphiAuthentication").and.returnValue(Promise.resolve({errorType: "", finishStatus: 1}))
  });

  it('Should validate Method launchSelphiAuthentication exists', () => {
    if (Capacitor.isNativePlatform()) {
      expect(service.launchSelphiAuthentication()).toBeTruthy();
    }
  });

  it('Should validate Method setSelphiFlow exists', () => {
    if (Capacitor.isNativePlatform()) {
      expect(service.setSelphiFlow()).toBeTruthy();
    }
  });

  it('Should validate SelphiCamera Enum exists', () => {
    expect(JSON.stringify(SelphiCamera)).toEqual(JSON.stringify(MockSelphiCamera));
  });

  it('Should validate SelphiCamera Enum exists', () => {
    expect(JSON.stringify(SelphiCamera)).toEqual(JSON.stringify(MockSelphiCamera));
  });

  it('Should validate SelphiFaceLivenessMode Enum exists', () => {
    expect(JSON.stringify(SelphiFaceLivenessMode)).toEqual(JSON.stringify(MockSelphiFaceLivenessMode));
  });

  it('Should validate SelphiCompressFormat Enum exists', () => {
    expect(JSON.stringify(SelphiCompressFormat)).toEqual(JSON.stringify(MockSelphiCompressFormat));
  });

  it('Should validate SelphiExtractionDuration Enum exists', () => {
    expect(JSON.stringify(SelphiExtractionDuration)).toEqual(JSON.stringify(MockSelphiExtractionDuration));
  });

  it('Should validate SelphiFaceResult Interface is correct', () => {
    let result: SelphiFaceResult = {
      errorType: "",
      finishStatus: 0,
      bestImage: "",
      bestImageCropped: "",
      bestImageTemplateRaw: "",
      errorMessage: "",
      finishStatusDescription: "",
      images: [""],
      qrData: "",
      template: "",
      templateRaw: ""
    }

    expect(result.finishStatus).toEqual(jasmine.any(Number));

    expect(result.errorMessage).toEqual(jasmine.any(String));
    expect(result.errorType).toEqual(jasmine.any(String));
    expect(result.bestImage).toEqual(jasmine.any(String));
    expect(result.bestImageCropped).toEqual(jasmine.any(String));
    expect(result.bestImageTemplateRaw).toEqual(jasmine.any(String));
  });

  it('Should validate SelphiFaceConfiguration Interface is correct', () => {
    let config: SelphiFaceConfiguration = {
      resourcesPath: "",
      cameraFlashEnabled: true,
      cameraId: 0,
      cameraPreferred: SelphiCamera.Back,
      compressFormat: SelphiCompressFormat.JPEG,
      cropPercent: 0.9,
      debug: true,
      enableGenerateTemplateRaw: true,
      extractionDuration: SelphiExtractionDuration.Long,
      fullscreen: true,
      isCameraFlash: true,
      jpgQuality: 0.9,
      livenessMode: SelphiFaceLivenessMode.Move,
      logImages: true,
      params: [],
      qrMode: true,
      showDiagnostic: true,
      showPreviousTip: true,
      showResultAfterCapture: true,
      showTutorial: true,
      stabilizationMode: true,
      translationsContent: "",
      templateRawOptimized: true,
      vibrationEnabled: true,
      videoFilename: "",
      viewsContent: ""
    };

    expect(config.cameraFlashEnabled).toBeTrue();
    expect(config.debug).toBeTrue();
    expect(config.enableGenerateTemplateRaw).toBeTrue();
    expect(config.fullscreen).toBeTrue();
    expect(config.isCameraFlash).toBeTrue();
    expect(config.logImages).toBeTrue();
    expect(config.qrMode).toBeTrue();
    expect(config.showDiagnostic).toBeTrue();
    expect(config.showPreviousTip).toBeTrue();
    expect(config.showResultAfterCapture).toBeTrue();
    expect(config.showTutorial).toBeTrue();
    expect(config.stabilizationMode).toBeTrue();
    expect(config.templateRawOptimized).toBeTrue();
    expect(config.vibrationEnabled).toBeTrue();

    expect(config.cropPercent).toEqual(jasmine.any(Number));
    expect(config.cameraId).toEqual(jasmine.any(Number));
    expect(config.jpgQuality).toEqual(jasmine.any(Number));

    expect(config.resourcesPath).toEqual(jasmine.any(String));
    expect(config.extractionDuration).toEqual(jasmine.any(String));
    expect(config.compressFormat).toEqual(jasmine.any(String));
    expect(config.livenessMode).toEqual(jasmine.any(String));
  });
});

enum MockSelphiCamera {
  Back = "BACK",
  Front = "FRONT"
};
enum MockSelphiFaceLivenessMode {
  None = "NONE",
  Passive = "PASSIVE",
  Move = "MOVE"
};
enum MockSelphiCompressFormat {
  JPEG = "jpeg",
  PNG = "png"
};
enum MockSelphiExtractionDuration {
  Long = "LONG",
  Medium = "MEDIUM",
  Short = "SHORT"
};
