import { Component, OnInit } from '@angular/core';
import { ToastService, NotificationType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toasts-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent implements OnInit {
  public NotificationType = NotificationType;

  constructor(public toastService: ToastService) {}

  ngOnInit(): void {}

  public getIconClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.Success:
        return 'fa-check';
      case NotificationType.Error:
        return 'fa-xmark';
      case NotificationType.Warning:
        return 'fa-triangle-exclamation';
      case NotificationType.Info:
        return 'fa-circle-info';
      default:
        return '';
    }
  }
}
