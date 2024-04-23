import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-generic-confirmation',
  templateUrl: './generic-confirmation.component.html',
})
export class GenericConfirmationComponent {
  @Input() title: string;
  @Input() body: string;
  @Input() rejectLabel: string;
  @Input() confirmLabel: string;

  constructor(public activeModal: NgbActiveModal) {
  }
}
