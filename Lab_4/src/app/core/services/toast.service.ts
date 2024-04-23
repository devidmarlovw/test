import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

export interface NotificationToast {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject: BehaviorSubject<NotificationToast | null> = new BehaviorSubject<NotificationToast | null>(null);

  public get toastSubject$(): Observable<NotificationToast | null> {
    return this.toastSubject.asObservable();
  }

  public showSuccess(message: string): void {
    this.show(message, NotificationType.Success);
  }

  public showError(message: string): void {
    this.show(message, NotificationType.Error);
  }

  public showWarning(message: string): void {
    this.show(message, NotificationType.Warning);
  }

  public showInfo(message: string): void {
    this.show(message, NotificationType.Info);
  }

  public remove(): void {
    this.toastSubject.next(null);
  }

  private show(message: string, type: NotificationType): void {
    this.toastSubject.next({ message, type });
  }
}


