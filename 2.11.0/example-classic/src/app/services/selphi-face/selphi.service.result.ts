export class SelphiResults {
    private mFinishStatus: number;
    private mTypeError: number;
    private mTemplateRaw: string;
    private mBestImage: string;
    private mBestImageCropped: string;

    constructor() { }

    get finishStatus() {
        return this.mFinishStatus;
      }
    set finishStatus(value) {
        this.mFinishStatus = value;
    }

    get typeError() {
        return this.mTypeError;
      }
    set typeError(value) {
        this.mTypeError = value;
    }

    get templateRaw() {
        return this.mTemplateRaw;
      }
    set templateRaw(value) {
        this.mTemplateRaw = value;
    }

    get bestImage() {
        return this.mBestImage;
      }
    set bestImage(value) {
        this.mBestImage = value;
    }

    get bestImageCropped() {
        return this.mBestImageCropped;
      }
    set bestImageCropped(value) {
        this.mBestImageCropped = value;
    }
}