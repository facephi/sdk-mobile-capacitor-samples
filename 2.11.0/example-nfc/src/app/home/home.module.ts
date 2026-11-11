import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonRow, IonTitle, IonToolbar } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonButton
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
