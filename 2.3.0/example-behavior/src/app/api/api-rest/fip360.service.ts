import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Fip360Service {
  private readonly url = 'https://xxx.xxx.com';
  private readonly headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  constructor(private http: HttpClient) {}

  getUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async getSessionId(method: string = '/api/init', bodyParams: Record<string, unknown> = {}): Promise<{ sessionId?: string } | null> {
    try {
      return await firstValueFrom(
        this.http.post<{ sessionId?: string }>(this.url + method, bodyParams, { headers: this.headers })
      );
    } catch (error) {
      console.error('getSessionId error', error);
      return null;
    }
  }
}
