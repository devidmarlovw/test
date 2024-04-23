import {Component, OnInit, Input, forwardRef, EventEmitter, Output} from '@angular/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'ado-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor {
  @Input() title: string | 'Data';
  @Input() minDate?: NgbDate;
  @Input() maxDate?: NgbDate;

  private _selectedValue;
  isDisabled = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  get selectedValue() {
    return this._selectedValue;
  }

  set selectedValue(val) {
    if (val !== undefined && this.selectedValue !== val) {
      this._selectedValue = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  writeValue(value: NgbDate) {
    this.selectedValue = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
