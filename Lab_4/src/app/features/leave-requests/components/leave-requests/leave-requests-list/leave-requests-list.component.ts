import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LeaveRequestDTO} from "../../../../../shared/models/leave-request/leave-request-dto";
import {LeaveRequestService} from "../../../../../core/services/leave-request-service/leave-request.service";
@Component({
    selector: 'ado-leave-requests-list',
    templateUrl: './leave-requests-list.component.html',
    styleUrls: ['./leave-requests-list.component.scss']
})
export class LeaveRequestsListComponent implements OnInit {
    selectedLeaveRequest: LeaveRequestDTO;
    @Input() leaveRequests: LeaveRequestDTO[]
    @Output() leaveRequestSelected= new EventEmitter<LeaveRequestDTO>()

    constructor(private leaveRequestService: LeaveRequestService )  {
    }

    ngOnInit(){
    }
    onSelectedLeaveRequest(leaveRequest: LeaveRequestDTO) {
        this.leaveRequestSelected.emit(leaveRequest) ;
    }


}
