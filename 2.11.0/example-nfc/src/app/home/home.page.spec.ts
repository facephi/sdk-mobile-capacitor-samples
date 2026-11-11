import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonRow, IonTitle, IonToolbar, provideIonicAngular } from '@ionic/angular';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonLabel, IonButton],
      providers: [provideIonicAngular()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
