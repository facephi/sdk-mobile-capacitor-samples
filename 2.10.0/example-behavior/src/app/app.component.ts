import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      console.log('initializeApp');
      setPrefersDarkMode();
    });
  }
}

function setPrefersDarkMode() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  console.log('prefersDark', prefersDark);
  if (prefersDark.matches) {
    document.body.classList.toggle('dark');
  }
}
