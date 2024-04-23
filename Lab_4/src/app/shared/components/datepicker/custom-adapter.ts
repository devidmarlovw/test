import {Injectable} from '@angular/core';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomNgbDateAdapter extends NgbDateAdapter<Date> {
  fromModel(value: Date | null): NgbDateStruct | null {
    if (value instanceof Date) {
      return {
        year: value.getFullYear(),
        month: value.getMonth() + 1,
        day: value.getDate(),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): Date | null {
    if (date) {
      return new Date(date.year, date.month - 1, date.day + 1);
    }
    return null;
  }
}
