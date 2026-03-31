import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class FacephiService {

  constructor( private http: HttpClient ) { }
 
  url: string = 'https://api.xxx-xxx.io';

  async extractDocumentData( tokenOCR: string )
  {
    const options = {
      url: this.url + '/services/extractDocumentData',
      headers: { 'x-api-key': 'xxx', 'Content-Type': 'application/json; charset=UTF-8', },
      data: { 'tokenOcr': tokenOCR }
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }

  async authenticalFacial(faceImage: string, bestImage: string)
  {
    const options = {
      url: this.url + '/authenticateFacial',
      headers: { 'x-api-key': 'xxx', 'Content-Type': 'application/json; charset=UTF-8', },
      data: { 'token1': faceImage, 'token2': bestImage, 'method': 1 }
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }

  async documentValidation(rawFrontDocument: string, rawBackDocument: string)
  {
    const options = {
      url: this.url + '/documentValidation',
      headers: { 'x-api-key': 'xxx', 'Content-Type': 'application/json; charset=UTF-8', },
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
      url: this.url + '/documentValidation',
      headers: { 'x-api-key': 'xxx', 'Content-Type': 'application/json; charset=UTF-8', },
      data: {
        'scanReference': scanReferenceResult,
        'type': typeResult,
      }
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }
}