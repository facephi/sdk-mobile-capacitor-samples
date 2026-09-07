import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-main-menu',
  templateUrl: './popover-main-menu.component.html',
  styleUrls: ['./popover-main-menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PopoverMainMenuComponent implements OnInit 
{
  darkMode: boolean = true;
  constructor(private popOverCtrl: PopoverController) 
  {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = prefersDark.matches;
  }

  ngOnInit() {}

  async closePopOver()
  {
    try 
    {
      await this.popOverCtrl.dismiss();
    } 
    catch (error) 
    {
      console.log("closePopOver fail", error);
    }
  }

  setDarkMode() 
  {
    console.log("this.darkMode", !this.darkMode);
    document.body.classList.toggle('dark', !this.darkMode);
  }
}
