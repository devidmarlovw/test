import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {GenericConfirmationComponent} from "../../shared/components/generic-confirmation/generic-confirmation.component";

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalService: NgbModal) {}

  openConfirmationModal(title: string, body: string, rejectLabel: string, confirmLabel: string) {
    const modalRef = this.modalService.open(GenericConfirmationComponent, {
      centered: true,
    });

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
    modalRef.componentInstance.rejectLabel = rejectLabel;
    modalRef.componentInstance.confirmLabel = confirmLabel;

    return modalRef.result;
  }
}
