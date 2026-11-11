import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonApp, IonRouterOutlet, IonicRouteStrategy, Platform, provideIonicAngular } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CoreService } from './services/core/core.service';

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [BrowserModule, IonApp, IonRouterOutlet, AppRoutingModule],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideHttpClient(withInterceptorsFromDi())
    ]
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