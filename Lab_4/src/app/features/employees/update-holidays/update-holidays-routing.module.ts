import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { EmployeesUpdateHolidaysComponent } from "./update-holidays.component";
const routes: Routes = [
  {
    path: '',
    component: EmployeesUpdateHolidaysComponent,


  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesUpdateHolidaysRoutingModule {}
