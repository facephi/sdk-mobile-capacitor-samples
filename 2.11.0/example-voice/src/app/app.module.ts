import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CoreService } from './services/core/core.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule 
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