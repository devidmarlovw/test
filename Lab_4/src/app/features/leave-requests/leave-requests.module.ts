import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveRequestsComponent } from './components/leave-requests/leave-requests.component';
import { LeaveRequestsListComponent } from './components/leave-requests/leave-requests-list/leave-requests-list.component';
import { LeaveRequestsDetailComponent } from './components/leave-requests/leave-requests-detail/leave-requests-detail.component';
import {SharedModule} from "../../shared/shared.module";
import {LeaveRequestsRoutingModule} from "./leave-requests-routing.module";



@NgModule({
  declarations: [
    LeaveRequestsComponent,
    LeaveRequestsListComponent,
    LeaveRequestsDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LeaveRequestsRoutingModule
  ]
})
export class LeaveRequestsModule { }
