import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { WgtFinishStatus } from '@fip360/widget-behavior-capacitor';
import { BehaviorService } from '../../services/behavior/behavior.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: 'home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  message = '';
  showError = false;

  constructor(
    private router: Router,
    public behaviorService: BehaviorService,
    private changeDetection: ChangeDetectorRef
  ) {}

  get user(): string {
    return this.behaviorService.userId;
  }

  private setError(message: string): void {
    this.message = message;
    this.showError = true;
    this.changeDetection.markForCheck();
  }

  launchSetPosition = async (position: string): Promise<void> => {
    console.log('Starting launchSetPosition...');
    this.showError = false;

    try {
      const result = await this.behaviorService.setPosition(position);
      console.log('setPosition result', result);

      if (result.finishStatus === WgtFinishStatus.Error) {
        this.setError(result.errorMessage || result.errorType || 'Unknown error');
      }
    } catch (error) {
      console.log('Error setPosition', error);
      this.setError(String(error));
    } finally {
      console.log('End setPosition...');
    }
  };

  goToDashboard = async (): Promise<void> => {
    await this.launchSetPosition('Dashboard');
    this.router.navigateByUrl('/dashboard');
  };

  onLogout = async (): Promise<void> => {
    this.behaviorService.userId = '';
    await this.launchSetPosition('Login');
    this.router.navigateByUrl('/login');
  };
}
