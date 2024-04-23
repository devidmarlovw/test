import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndividualHolidayComponent } from './components/individual-holiday/individual-holiday.component';
import { IndividualHolidayCalendarComponent } from './components/individual-holiday/individual-holiday-calendar/individual-holiday-calendar.component';
import { IndividualHolidayDetailedComponent } from './components/individual-holiday/individual-holiday-detailed/individual-holiday-detailed.component';
import {SharedModule} from "../../shared/shared.module";
import { FullCalendarModule } from '@fullcalendar/angular';
import {IndividualHolidaysRoutingModule} from "./individual-holidays-routing.module";
import {NgbDateAdapter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CustomNgbDateAdapter } from '../../shared/components/datepicker/custom-adapter';


@NgModule({
  declarations: [
    IndividualHolidayComponent,
    IndividualHolidayCalendarComponent,
    IndividualHolidayDetailedComponent
  ],

  imports: [
    CommonModule,
    IndividualHolidaysRoutingModule,
    SharedModule,
    FullCalendarModule,
    NgbModule
  ],
  // providers: [{ provide: NgbDateAdapter, useClass: CustomNgbDateAdapter }],
})
export class IndividualHolidaysModule { }
