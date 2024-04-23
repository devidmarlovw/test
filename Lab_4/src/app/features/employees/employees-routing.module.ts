import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './components';
import { EmployeesManagementComponent } from './management/employees-management.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent,
    children: [
      {path: 'management', component: EmployeesManagementComponent,
      data: {
        roles: ['HR'],
      },
    },

     // {path: 'update-holidays', component: EmployeesUpdateHolidaysComponent},
     // {path: '**', redirectTo: 'management', pathMatch: 'full'}

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
