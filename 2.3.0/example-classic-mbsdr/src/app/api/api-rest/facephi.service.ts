import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class FacephiService 
{
  constructor( private http: HttpClient ) { }
 
  url: string   = 'https://api.xxx-xxx.xxx/iad';

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
    };

    console.log(options);
    return CapacitorHttp.post(options);
  }
}