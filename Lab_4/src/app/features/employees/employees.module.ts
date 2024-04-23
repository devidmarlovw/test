import { NgModule } from '@angular/core';

import { COMPONENTS } from './components';
import { EmployeesRoutingModule } from './employees-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeService } from '../../core/services/employee.service';
import { NamePipe } from './pipes/name.pipe';
import { StatusPipe } from './pipes/status.pipe';
import { TeamsPipe } from './pipes/teams.pipe';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [...COMPONENTS,
                  NamePipe,
                  StatusPipe,
                  TeamsPipe],
  imports: [
    EmployeesRoutingModule,
    SharedModule,
    CommonModule,
    NgbModule,

  ],
  providers: [EmployeeService],
})
export class EmployeesModule {}
