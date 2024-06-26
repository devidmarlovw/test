import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LeaveRequestsComponent} from "./components/leave-requests/leave-requests.component";

const routes: Routes = [
  {
    path: '',
    component: LeaveRequestsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveRequestsRoutingModule {}
