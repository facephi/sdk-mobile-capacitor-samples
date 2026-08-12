import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PluginListenerHandle } from '@capacitor/core';
import { registerField, WgtFinishStatus } from '@fip360/widget-behavior-capacitor';
import { Fip360Service } from '../../api/api-rest/fip360.service';
import { BehaviorService } from '../../services/behavior/behavior.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class LoginPage implements OnInit, AfterViewInit, OnDestroy {
  user = '';
  message = '';
  showError = false;
  localError = '';
  private eventsListener?: PluginListenerHandle;
  private fieldsRegistered = false;

  constructor(
    private router: Router,
    public behaviorService: BehaviorService,
    private fip360Service: Fip360Service,
    private changeDetection: ChangeDetectorRef
  ) {}

  get session(): string {
    return this.behaviorService.sessionId;
  }

  async ngOnInit(): Promise<void> {
    this.eventsListener = await this.behaviorService.addEventsListener((response: any) => {
      console.log('WGT_BEHAVIOR_EVENTS', response);
    });

    if (!this.behaviorService.sessionId) {
      await this.launchInitialize();
    }
  }

  async ngAfterViewInit(): Promise<void> {
    await this.registerTypingField();
  }

  ngOnDestroy(): void {
    this.eventsListener?.remove();
  }

  private setError(message: string): void {
    this.message = message;
    this.showError = true;
    this.changeDetection.markForCheck();
  }

  private clearError(): void {
    this.showError = false;
    this.changeDetection.markForCheck();
  }

  launchInitialize = async (): Promise<void> => {
    console.log('Starting launchInitialize...');
    this.clearError();

    try {
      const result = await this.behaviorService.initialize();
      console.log('initialize result', result);

      if (result.finishStatus === WgtFinishStatus.Ok) {
        await this.launchSetSessionId();
        await this.launchSetAutoLogoutAction();
        await this.launchSetPosition('Login');
      } else if (result.finishStatus === WgtFinishStatus.Error) {
        this.setError(result.errorMessage || result.errorType || 'Unknown error');
      }
    } catch (error) {
      console.log('Error initialize', error);
      this.setError(String(error));
    } finally {
      console.log('End initialize...');
      this.changeDetection.markForCheck();
    }
  };

  launchClearSession = async (): Promise<void> => {
    console.log('Starting launchClearSession...');
    try {
      const result = await this.behaviorService.clearSessionData();
      console.log('clearSessionData result', result);
      this.behaviorService.sessionId = '';
    } catch (error) {
      console.log('Error launchClearSession', error);
    } finally {
      console.log('End launchClearSession...');
      this.changeDetection.markForCheck();
    }
  };

  launchSetAutoLogoutAction = async (): Promise<void> => {
    try {
      const result = await this.behaviorService.setAutoLogoutAction();
      console.log('setAutoLogoutAction result', result);
    } catch (error) {
      console.log('Error setAutoLogoutAction', error);
    }
  };

  launchSetSessionId = async (): Promise<void> => {
    console.log('Starting launchSetSessionId...');
    this.clearError();

    const res = await this.fip360Service.getSessionId('/api/init', {});
    console.log('getSessionId apiRest', res);
    const sessionId = res?.sessionId ? res.sessionId : this.fip360Service.getUUID();

    try {
      const result = await this.behaviorService.setSessionId(sessionId);
      console.log('setSessionId result', result);

      if (result.finishStatus === WgtFinishStatus.Ok) {
        this.behaviorService.sessionId = sessionId;
      } else if (result.finishStatus === WgtFinishStatus.Error) {
        this.setError(result.errorMessage || result.errorType || 'Unknown error');
      }
    } catch (error) {
      console.log('Error setSessionId', error);
      this.setError(String(error));
    } finally {
      console.log('End setSessionId...');
    }
  };

  launchSetUserId = async (user: string): Promise<void> => {
    console.log('Starting launchSetUserId...');
    this.clearError();

    try {
      const result = await this.behaviorService.setUserId(user);
      console.log('setUserId result', result);

      if (result.finishStatus === WgtFinishStatus.Ok) {
        this.behaviorService.userId = user;
      } else if (result.finishStatus === WgtFinishStatus.Error) {
        this.setError(result.errorMessage || result.errorType || 'Unknown error');
      }
    } catch (error) {
      console.log('Error setUserId', error);
      this.setError(String(error));
    } finally {
      console.log('End setUserId...');
    }
  };

  launchSetPosition = async (position: string): Promise<void> => {
    console.log('Starting launchSetPosition...');
    this.clearError();

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

  handleSubmit = async (): Promise<void> => {
    if (!this.user.trim()) {
      this.localError = 'User is required';
      this.changeDetection.markForCheck();
      return;
    }

    this.localError = '';
    const user = this.user.trim();
    await this.launchSetUserId(user);
    await this.launchSetPosition('Home');
    this.router.navigateByUrl('/home');
  };

  private registerTypingField = async (): Promise<void> => 
  {
    if (this.fieldsRegistered) {
      return;
    }

    const ionInputUser = document.getElementById('userInput') as HTMLIonInputElement | null;
    if (!ionInputUser) {
      console.log('userInput not found');
      return;
    }

    const userInput = await ionInputUser.getInputElement();
    registerField(userInput, 'user');
    this.fieldsRegistered = true;
    console.log('registerField: userInput ready');
  };
}
