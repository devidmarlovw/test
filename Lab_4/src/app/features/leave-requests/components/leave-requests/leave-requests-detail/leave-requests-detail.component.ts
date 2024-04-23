import {Component, Input, OnInit} from '@angular/core';
import {LeaveRequestDTO} from "../../../../../shared/models/leave-request/leave-request-dto";
import {LeaveRequestService} from "../../../../../core/services/leave-request-service/leave-request.service";

@Component({
    selector: 'ado-leave-requests-detail',
    templateUrl: './leave-requests-detail.component.html',
    styleUrls: ['./leave-requests-detail.component.scss']
})
export class LeaveRequestsDetailComponent implements OnInit {
    @Input() selectedLeaveRequest: LeaveRequestDTO;


    constructor(private leaveRequestService:LeaveRequestService) {

    }

    ngOnInit(): void {
    }
  onclickaccept(){
      this.leaveRequestService.acceptRequest(this.selectedLeaveRequest.id , this.selectedLeaveRequest.employeeDetails.employeeId , this.selectedLeaveRequest.v).subscribe()
  }

  onclickreject(){
      this.leaveRequestService.refuseRequest(this.selectedLeaveRequest.id, this.selectedLeaveRequest.employeeDetails.employeeId, this.selectedLeaveRequest.v, this.selectedLeaveRequest.rejectReason = "LOL").subscribe()
  }
}

