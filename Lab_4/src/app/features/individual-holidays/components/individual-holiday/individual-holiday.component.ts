import { Component, OnInit } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IndividualHolidaysRequestService } from 'src/app/core/services/holidays-request-service/individual-holidays-request.service';
import { LoginService } from 'src/app/features/login/services/login.service';
import { IndividualHolidaysRequestDto } from '../../models/holidays';

@Component({
  selector: 'ado-individual-holiday',
  templateUrl: './individual-holiday.component.html',
  styleUrls: ['./individual-holiday.component.scss']
})
export class IndividualHolidayComponent implements OnInit {

  startDate: NgbDate;
  endDate: NgbDate;
  selectedPeriod: { start: string; end: string; };
  requests : IndividualHolidaysRequestDto[];
  selectedItem: IndividualHolidaysRequestDto;
  private subscriptions = [];
  private userId: string;

  constructor(
    private holidaysService: IndividualHolidaysRequestService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.loginService.currentUserDetails().subscribe(user => {
        this.userId = user.employeeId;
        this.loadData();
      })
    );
  }

  private loadData() {
    this.subscriptions.push(
      this.holidaysService
        .getIndividualHolidaysRequestBetweenDates(
          this.userId
        )
        .subscribe(requests => {
          this.requests = requests;
          if (this.selectedItem) {
            this.getRequestById(this.selectedItem.id.toString());
          }
        })
    );
  }

  getRequestById(id: string) {
    this.selectedItem = this.holidaysService.getIndividualHolidaysRequestById(
      id
    );
  }

  onRefresh(shouldRefresh: boolean){
    if(shouldRefresh){
      this.loadData();
    }
  }

  handleSelectedDateRange(selectedRange: { start: string; end: string }) {
    this.selectedPeriod = selectedRange;
  }
}

