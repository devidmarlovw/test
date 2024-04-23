import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Calendar, CalendarOptions, EventClickArg, EventInput} from '@fullcalendar/core';
import roLocale from '@fullcalendar/core/locales/ro';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin from '@fullcalendar/moment';
import {Subscription} from "rxjs";
import {IndividualHolidaysRequestService} from "../../../../../core/services/holidays-request-service/individual-holidays-request.service";
import {convertFromDateToStringDate} from "../../../../../utils/date-methods";
import {LoginService} from "../../../../login/services/login.service";
import {IndividualHolidaysRequestDto} from "../../../models/holidays";
import {ToastService, NotificationType} from "../../../../../core/services/toast.service";

@Component({
  selector: 'ado-individual-holiday-calendar',
  templateUrl: './individual-holiday-calendar.component.html',
  styleUrls: ['./individual-holiday-calendar.component.scss']
})

export class IndividualHolidayCalendarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items: IndividualHolidaysRequestDto[];
  @Output() selectedDateRange: EventEmitter<{ start: string; end: string }> = new EventEmitter();
  @Output() selectedEventId = new EventEmitter<string>();

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, momentPlugin],
    locale: roLocale,
    eventTextColor: 'white',
    editable: false,
    droppable: false,
    dayHeaderFormat: {weekday: 'long'},
    selectable: true,
    selectMirror: true,
    selectOverlap: true,
    dayMaxEvents: true,
    displayEventEnd: true,
    weekends: false,
    // validRange: {start: new Date(), end: new Date(2024,10,10)},
    // visibleRange: {start: new Date(1997,10,10)},
    events: [],

    select: (info) => {
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const adjustedEndDate = this.removeDay(info.end);


      if (info.start >= startOfMonth) {

        this.selectedDateRange.emit({start: convertFromDateToStringDate(info.start), end: adjustedEndDate});
      } else {
        this.toastService.showInfo('Ai selectat o perioadă din luna trecută, poți să o faci doar pe luna actuală sau viitoare.');
        const calendarApi = info.view.calendar;
        calendarApi.unselect();
      }
    },
    eventClick: (clickInfo: EventClickArg) => {
      this.selectedEventId.emit(clickInfo.event.id)
    }
  };

  private subscription = new Subscription();
  requests: EventInput[];


  constructor(private individualHolidaysService: IndividualHolidaysRequestService,
              private loginService: LoginService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.requests = [];

      if (this.items)
        this.items.forEach(item => {
          this.requests.push(this.getEvent(item));
        });

      this.calendarOptions.events = this.requests;
    }
  }

  getEvent(request: IndividualHolidaysRequestDto) {
    let colorStatus: string, description: string;

    switch (request.status) {
      case 'REJECTED':
        colorStatus = '#ff0000';
        description = 'Concediu refuzat';
        break;
      case 'PENDING':
        colorStatus = '#0000ff';
        description = 'Concediu in asteptare';
        break;
      case 'APPROVED':
        colorStatus = '#008a3f';
        description = 'Concediu acceptat';
        break;
      default:
        colorStatus = '#f8d053';
        description = 'Concediu invalid';
    }

    const newReq: EventInput = {
      id: request.id.toString(),
      title: description,
      start: request.startDate,
      end: this.addDay(request.endDate),
      allDay: true,
      color: colorStatus,
    };

    return newReq;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }

  addDay(date: string): string {
    const values = date.split('-');
    const newFormatDate = new Date(
      new Date(
        Number(values[0]),
        Number(values[1]),
        Number(values[2])
      ).getTime() + 86400000
    );

    return `${newFormatDate.getFullYear()}-${String(
      newFormatDate.getMonth()
    ).padStart(2, '0')}-${String(newFormatDate.getDate()).padStart(2, '0')}`;
  }

  removeDay(date: Date): string {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);

    return convertFromDateToStringDate(newDate);
  }

}
