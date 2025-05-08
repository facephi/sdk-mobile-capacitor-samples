import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class FacephiService {

  constructor( private http: HttpClient ) { }
 
  url: string   = 'https://api-services';
  url2: string  = '';
  headers: any  = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    //'Content-type': 'application/json',
    //'Access-Control-Allow-Headers': 'Content-Type',
    //'Access-Control-Request-Headers': 'X-Custom-Header',
    //'Access-Control-Allow-Methods': 'POST',
    //'Access-Control-Allow-Origin' : '*',
    'client-id' : '', 
    'token-app' : '',
    'x-api-key' : '',
    //'app-name'  : ''  
  };

  evaluateLiveness( img: any ) 
  {
    //const headers = { 'Authorization': JSON.stringify('this.user'), 'client-id': '31', 'token-app': '' }
    const body    = { bestImage: img }

    return this.http.post<any[]>(
      this.url + '/evaluateLiveness', body, this.headers,
    );
  }

  authenticateFacial( tokenFaceImage: any, templateRaw: any ) 
  {
    //const headers = { 'Authorization': JSON.stringify('this.user'), 'client-id': '31', 'token-app': '' }
    const body = { token1: tokenFaceImage, token2: templateRaw, "method": 5 }
    
    return this.http.post<any[]>(
      this.url + '/authenticateFacial', body, this.headers,
    );
  }

  passiveLivenessEvaluate( data: string, bestImage: string ) 
  {
    /*const body = {'extraData': data, 'image': bestImage};
    
    return this.http.post<any[]>(
      this.url2 + '/v5/api/v1/selphid/passive-liveness/evaluate', body, {},
    );*/

    const options = {
      url: this.url2 + '/v5/api/v1/selphid/passive-liveness/evaluate',
      headers: { 'Content-Type': 'application/json; charset=UTF-8', },
      data: {'extraData': data, 'image': bestImage},
    };
  
    return CapacitorHttp.post(options);
  }

  authenticateFacialDocument( tokenFaceImage: string, data: string, bestImage: string ) 
  {
    /*const body = {'documentTemplate': tokenFaceImage, 'extraData': data, 'image1': bestImage};
    
    return this.http.post<any[]>(
      this.url2 + '/v5/api/v1/selphid/authenticate-facial/document/face-image', body, {},
    );*/

    const options = {
      url: this.url2 + '/v5/api/v1/selphid/authenticate-facial/document/face-image',
      headers: { 'Content-Type': 'application/json; charset=UTF-8', },
      data: { 'documentTemplate': tokenFaceImage, 'extraData': data, 'image1': bestImage }
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }
}