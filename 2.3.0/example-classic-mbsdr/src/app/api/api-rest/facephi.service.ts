import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class FacephiService 
{
  constructor( private http: HttpClient ) { }
 
  url: string   = 'https://api.xxx-xxx.xxx/xxx';
  async extractDocumentData( tokenOCR: string )
  {
    const options = {
      url: this.url + '/services/extractDocumentData',
      headers: { 'x-api-key': '', 'Content-Type': 'application/json; charset=UTF-8', },
      data: { 'tokenOcr': tokenOCR }
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }

  async authenticalFacial(faceImage: string, bestImage: string)
  {
    const options = {
      url: this.url + '/services/authenticateFacial',
      headers: { 'x-api-key': '', 'Content-Type': 'application/json; charset=UTF-8', },
      data: { 'token1': faceImage, 'token2': bestImage, 'method': 1 }
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }

  async documentValidation(rawFrontDocument: string, rawBackDocument: string)
  {
    const options = {
      url: this.url + '/verify/documentValidation/v2/start',
      headers: { 'x-api-key': '', 'Content-Type': 'application/json; charset=UTF-8', },
      data: {
        'country': "AR",
        'idType': "ID_CARD",
        'documentRawImageMimeType': 'image/jpeg',
        'documentFrontRawImage': rawFrontDocument,
        'documentBackRawImage': rawBackDocument 
      }
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }

  async documentValidationStatus( 
    maxIntentos: number         = 10, 
    intervalo: number           = 2000, 
    scanReferenceResult: string = '', 
    typeResult: string          = '' 
  )
  {
    const options = {
      url: this.url + '/verify/documentValidation/v2/status',
      headers: { 'x-api-key': '', 'Content-Type': 'application/json; charset=UTF-8', },
      data: {
        'scanReference': scanReferenceResult,
        'type': typeResult,
      }
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }

  callIAD( iad: string ) 
  { 
    const options: HttpOptions = {
      url: this.url,
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'xxx' },
      data: iad,
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }

  callIADByBytes( iad: string ) 
  { 
    const options: HttpOptions = {
      url: this.url,
      headers: { 'Content-Type': 'application/octet-stream', 'x-api-key': 'xxx' },
      data: iad,
      dataType: 'file',
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }
}