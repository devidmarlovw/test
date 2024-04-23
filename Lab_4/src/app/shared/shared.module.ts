import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { GenericConfirmationComponent } from './components/generic-confirmation/generic-confirmation.component';
import { LoginRoutingModule } from '../features/login/login-routing.module';
import {DatepickerComponent} from "./components/datepicker/datepicker.component";
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@NgModule({
  declarations: [DropdownComponent,
    GenericConfirmationComponent,
    DatepickerComponent,
    ToastContainerComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ],
  exports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownComponent,
    GenericConfirmationComponent,
    DatepickerComponent,
    LoginRoutingModule,
    ToastContainerComponent
  ],
  providers: [],
})
export class SharedModule {}
