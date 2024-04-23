import { DatePipe } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface IMonthFormat {
  monthName: string;
  monthNumber: number;
}

export function getCurrentMonth(): IMonthFormat {
  const date = new Date();
  return {
    monthName: date.toLocaleString('ro-Ro', { month: 'long' }),
    monthNumber: date.getMonth(),
  };
}

export function getPrevMonth(currentMonthNumber: number): IMonthFormat {
  const date = new Date();
  if (currentMonthNumber === 0) {
    return {
      monthName: new Date(date.setMonth(11)).toLocaleString('ro-Ro', {
        month: 'long',
      }),
      monthNumber: 11,
    };
  }
  return {
    monthName: new Date(date.setMonth(currentMonthNumber - 1)).toLocaleString(
      'ro-Ro',
      { month: 'long' }
    ),
    monthNumber: currentMonthNumber - 1,
  };
}

export function getNextMonth(currentMonthNumber: number): IMonthFormat {
  const date = new Date();
  if (currentMonthNumber === 11) {
    return {
      monthName: new Date(date.setMonth(0)).toLocaleString('ro-Ro', {
        month: 'long',
      }),
      monthNumber: 0,
    };
  }

  return {
    monthName: new Date(date.setMonth(currentMonthNumber + 1)).toLocaleString(
      'ro-Ro',
      { month: 'long' }
    ),
    monthNumber: currentMonthNumber + 1,
  };
}

export function getCurrentYear(): number {
  const date = new Date();
  return date.getFullYear();
}

export function getNumberOfDaysInMonth(currentMonth: number): number {
  const date = new Date();
  return new Date(date.getFullYear(), currentMonth + 1, 0).getDate();
}

export function getWeekendDays(
  currentMonth: number,
  currentYear: number
): number[] {
  const daysInMonth = getNumberOfDaysInMonth(currentMonth);
  const weekendDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(currentYear, currentMonth, i);
    if (day.getDay() === 0 || day.getDay() === 6) {
      weekendDays.push(i - 1);
    }
  }
  return weekendDays;
}

export function fromStringToNgbDate(date: string): NgbDate {
  const values = date.split('-');
  return new NgbDate(Number(values[0]), Number(values[1]), Number(values[2]));
}

export function fromStringToDate(date: string): Date {
  const values = date.split('-');
  return new Date(Number(values[0]), Number(values[1]) - 1, Number(values[2]));
}

export function fromNgbDateToDate(date: NgbDate): Date {
  return new Date(date.year, date.month - 1, date.day);
}

export function fromDateToNgbDate(date: Date): NgbDate {
  return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function addDay(date: Date): Date {
  return new Date(date.getTime() + 86400000);
}

export function fromNgbDateToString(date: NgbDate): string {
  return convertFromDateToStringDate(fromNgbDateToDate(date));
}

export function convertFromDateToStringDate(date: Date): string {
  const d = new DatePipe('en-US').transform(date, 'yyyy-MM-dd');

  if (d) {
    return d;
  }

  return '';
}
