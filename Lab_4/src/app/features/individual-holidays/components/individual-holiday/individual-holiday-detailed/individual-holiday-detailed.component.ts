import {
  Component,
  Input,
  OnInit,
  OnChanges,
  EventEmitter,
  Output,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IndividualHolidaysRequestService } from '../../../../../core/services/holidays-request-service/individual-holidays-request.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IndividualHolidaysRequestDto } from '../../../models/holidays';
import { LoginService } from '../../../../login/services/login.service';
import { of, Subscription, switchMap } from 'rxjs';
import { IndividualHolidaysUpdateRequest } from '../../../models/requests';
import {
  convertFromDateToStringDate,
  fromNgbDateToDate,
  fromStringToNgbDate,
} from 'src/app/utils/date-methods';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectOption } from 'src/app/shared/models/select-option';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../../../../core/services/toast.service';
import { ModalService } from '../../../../../core/services/modal.service';
import { IndividualHolidaysEditRequest } from '../../../models/update-requests';

@Component({
  selector: 'ado-individual-holiday-detailed',
  templateUrl: './individual-holiday-detailed.component.html',
  styleUrls: ['./individual-holiday-detailed.component.scss'],
})
export class IndividualHolidayDetailedComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() mode: 'view' | 'add' | 'edit';
  @Input() selectedPeriod: { start: string; end: string };
  @Input() selectedLeaveRequest: IndividualHolidaysRequestDto;
  @Input() remainingDays = 0;
  @Output() modeChange = new EventEmitter<string>();
  @Output() individualHolidaysUpdate = new EventEmitter<boolean>();

  private subscription = new Subscription();
  vacationTypes: SelectOption[] = [
    { value: 'VACATION', label: 'Vacanta' },
    { value: 'MEDICAL', label: 'Concediu medical' },
  ];
  statusTypes: SelectOption[] = [
    { value: 'PENDING', label: 'In asteptare' },
    { value: 'ACCEPTED', label: 'Acceptat' },
    { value: 'REJECTED', label: 'Refuzat' },
  ];
  formRequest: FormGroup;
  minDate = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, 1);
  maxDate = new NgbDate(new Date().getFullYear() + 1, 12, 31);

  constructor(
    private individualHolidaysService: IndividualHolidaysRequestService,
    private http: HttpClient,
    private loginService: LoginService,
    private toastService: ToastService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.formRequest = new FormGroup({
      typeRequest: new FormControl(
        { value: ' ', disabled: false },
        Validators.required
      ),
      dates: new FormGroup({
        startDate: new FormControl(
          { value: '', disabled: false },
          Validators.required
        ),
        endDate: new FormControl(
          { value: '', disabled: false },
          Validators.required
        ),
      }),
      mentions: new FormControl({ value: '', disabled: false }),
      status: new FormControl({ value: '', disabled: true }),
      motive: new FormControl({ value: '', disabled: true }),
    });

    this.mode = 'add';

    this.subscription.add(
      this.loginService.currentUserDetails().subscribe((userDetails: any) => {
        this.subscription.add(
          this.individualHolidaysService
            .getRemainingHolidaysForCurrentUser(userDetails.employeeId)
            .subscribe((value: any) => {
              this.remainingDays = value.remainingDays;
            })
        );
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedPeriod']) {
      this.onSelectedPeriodChanged();
    }

    if (changes['selectedLeaveRequest'] && this.formRequest) {
      this.mode = 'view';
      if (this.selectedLeaveRequest) {
        this.formRequest.patchValue({
          typeRequest: this.selectedLeaveRequest.type,
          dates: {
            startDate: fromStringToNgbDate(this.selectedLeaveRequest.startDate),
            endDate: fromStringToNgbDate(this.selectedLeaveRequest.endDate),
          },
          mentions: this.selectedLeaveRequest.description,
          status: this.selectedLeaveRequest.status,
        });
        this.formRequest.disable();
      }
    }
  }

  private onSelectedPeriodChanged() {
    if (this.formRequest) {
      this.formRequest.patchValue({
        dates: {
          startDate: fromStringToNgbDate(this.selectedPeriod.start),
          endDate: fromStringToNgbDate(this.selectedPeriod.end),
        },
        typeRequest: 'VACATION',
      });
    }
  }

  onAddRequest() {
    const newRequest: IndividualHolidaysUpdateRequest = {
      startDate: convertFromDateToStringDate(
        fromNgbDateToDate(this.formRequest.controls.dates.value.startDate)
      ),
      endDate: convertFromDateToStringDate(
        fromNgbDateToDate(this.formRequest.controls.dates.value.endDate)
      ),
      type: this.formRequest.controls.typeRequest.value,
      description: this.formRequest.controls.mentions.value,
      status: 'PENDING',
    };

    this.subscription.add(
      this.loginService
        .currentUserDetails()
        .pipe(
          switchMap((userDetails: any) => {
            const employeeId = userDetails.employeeId;
            return this.individualHolidaysService
              .addIndividualHolidaysRequest(employeeId, newRequest)
              .pipe(
                catchError(error => {
                  this.toastService.showError('Nu mai sunt zile disponibile.');
                  return of(null);
                })
              );
          }),
          switchMap(() => {
            return this.loginService.currentUserDetails();
          }),
          switchMap((userDetails: any) => {
            const employeeId = userDetails.employeeId;
            return this.individualHolidaysService.getRemainingHolidaysForCurrentUser(
              employeeId
            );
          })
        )
        .subscribe((value: any) => {
          this.remainingDays = value.remainingDays;
          this.individualHolidaysUpdate.emit(true);
        })
    );
  }

  onDeleteRequest() {
    if (this.selectedLeaveRequest) {
      this.loginService.currentUserDetails().subscribe(userDetails => {
        if (userDetails) {
          const idUser = userDetails.employeeId;
          const requestId = this.selectedLeaveRequest.id;
          const employeeId = userDetails.employeeId;
          const startDate = this.selectedLeaveRequest.startDate;
          const endDate = this.selectedLeaveRequest.endDate;
          const title = 'Stergere cerere';
          const body = `Sunteti sigur ca doriti sa stergeti aceasta cerere din perioada ${startDate} — ${endDate} ?`;
          const rejectLabel = 'Renunta';
          const confirmLabel = 'Sterge';

          this.modalService
            .openConfirmationModal(title, body, rejectLabel, confirmLabel)
            .then(result => {
              if (result) {
                this.subscription.add(this.individualHolidaysService
                  .deleteIndividualHolidaysRequest(
                    idUser,
                    requestId,
                    employeeId
                  )
                  .pipe(
                    catchError(error => {
                      this.toastService.showError('Eroare sterge cerere.');
                      throw error;
                    })
                  )
                  .subscribe(() => {
                    this.toastService.showSuccess('Cerere stearsa cu success.');
                    this.individualHolidaysService
                      .getRemainingHolidaysForCurrentUser(employeeId)
                      .subscribe((value: any) => {
                        this.remainingDays = value.remainingDays;
                        this.individualHolidaysUpdate.emit(true);
                        this.formRequest.reset();
                      });
                  })
                );
              }
            })
            .catch(error => {
              console.error('Modal error.', error);
            });
        }
      });
    }
  }

  onCancel() {
    this.mode = 'view';
    if (this.formRequest) {
      this.formRequest.disable();
    }
  }

  onSave() {
    if (this.selectedLeaveRequest) {
      this.loginService.currentUserDetails().subscribe(userDetails => {
        if (userDetails) {
          const idUser = userDetails.employeeId;
          const idRequest = this.selectedLeaveRequest.id;
          const newHolidaysRequest: IndividualHolidaysEditRequest = {
            v: this.selectedLeaveRequest.v,
            startDate: convertFromDateToStringDate(
              fromNgbDateToDate(this.formRequest.controls.dates.value.startDate)
            ),
            endDate: convertFromDateToStringDate(
              fromNgbDateToDate(this.formRequest.controls.dates.value.endDate)
            ),
            type: this.formRequest.controls.typeRequest.value,
            description: this.formRequest.controls.mentions.value,
            status: this.formRequest.controls.status.value,
          };

          this.subscription.add(
            this.individualHolidaysService
            .editIndividualHolidaysRequest(
              idUser,
              idRequest,
              newHolidaysRequest
            )
            .pipe(
              catchError(error => {
                this.toastService.showError('Eroare editare cerere.');
                throw error;
              })
            )
            .subscribe(() => {
              this.individualHolidaysService
                .getRemainingHolidaysForCurrentUser(userDetails.employeeId)
                .subscribe((value: any) => {
                  this.remainingDays = value.remainingDays;
                  this.individualHolidaysUpdate.emit(true);
                  this.toastService.showSuccess('Cerere editata cu success.');
                });
            })
          );
        }
      });
    }
    this.mode = 'view';
  }

  onEdit() {
    this.formRequest.enable();
    this.mode = 'edit';
  }

  onMoveToNewRequest() {
    this.mode = 'add';
    this.formRequest.reset();
    this.formRequest.enable();
    this.selectedLeaveRequest = null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
