import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { EmployeesManagementComponent } from "./employees-management.component";
import { EmployeesManagementDetailComponent, EmployeesManagementListComponent } from "../components";


const routes: Routes = [
  {
    path: '',
    component: EmployeesManagementComponent,



  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesManagementRoutingModule {}
