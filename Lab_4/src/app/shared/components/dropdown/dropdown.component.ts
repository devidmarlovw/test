import {
  Component,
  Input,
  OnInit,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '../../models/select-option';

@Component({
  selector: 'ado-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() options: SelectOption[];
  @Input() title = '';
  selectedOption: SelectOption;

  isOpen = false;
  isDisabled = false;

  private onChangeCallback: (value: any) => void;

  writeValue(value: any): void {
    this.selectedOption = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {}

  onChange(value: any) {
    this.selectedOption = value;
    this.onChangeCallback(value);
  }

  onClickOutside() {
    this.isOpen = false;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
