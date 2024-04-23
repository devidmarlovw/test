import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/ui/layout/layout.component';
import {IndividualHolidayComponent} from "./features/individual-holidays/components/individual-holiday/individual-holiday.component";
import {LeaveRequestsComponent} from "./features/leave-requests/components/leave-requests/leave-requests.component";
import {AuthGuard} from "./core/guards/auth-guard/auth.guard";
import {LoginComponent} from "./features/login/components/login.component";


const routes: Routes = [
  { path: '', redirectTo: 'holidays', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'employees',
        data: {
          roles: ['HR'],
        },
        loadChildren: () =>
          import('./features/employees/employees.module').then(m => m.EmployeesModule),
      },
      {
        path: 'holidays',
        data: {
          roles: ['HR', 'TEAM_LEAD', 'USER'],
        },
        loadChildren: () =>
          import('./features/individual-holidays/individual-holidays.module').then(m => m.IndividualHolidaysModule)
      },
      {
        path: 'requests',
        data: {
          roles: ['HR', 'TEAM_LEAD'],
        },
        loadChildren: () =>
          import('./features/leave-requests/leave-requests.module').then(m => m.LeaveRequestsModule)
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'employees',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then(m => m.LoginModule),
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
