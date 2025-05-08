import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CoreService } from './services/core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
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
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  console.log("prefersDark", prefersDark);
  if (prefersDark.matches) 
  {
    document.body.classList.toggle('dark');
  }
}