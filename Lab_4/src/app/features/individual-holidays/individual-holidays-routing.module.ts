import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndividualHolidayComponent } from './components/individual-holiday/individual-holiday.component';

const routes: Routes = [
  {
    path: '',
    component: IndividualHolidayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndividualHolidaysRoutingModule {}
