import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CoreService } from './services/core/core.service';
import { APP_DARK_MODE_STORAGE_KEY } from './constants';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false
})
export class AppComponent 
{
  constructor(private platform: Platform, private coreService: CoreService) 
  {
    this.platform.ready().then(() => 
    {
      console.log('initializeApp');
      setPrefersDarkMode();
      this.coreService.initSession();
    });
  }
}

function setPrefersDarkMode() 
{
  let dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  try {
    const stored = localStorage.getItem(APP_DARK_MODE_STORAGE_KEY);
    if (stored === '1') dark = true;
    if (stored === '0') dark = false;
  } catch {
    /* modo privado u otro bloqueo */
  }
  document.body.classList.toggle('app-dark-mode', dark);
  document.documentElement.style.setProperty('color-scheme', dark ? 'dark' : 'light');
}