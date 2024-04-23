import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LeaveRequestService} from "../../../../core/services/leave-request-service/leave-request.service";
import {LeaveRequestDTO} from "../../../../shared/models/leave-request/leave-request-dto";
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'ado-leave-requests',
    templateUrl: './leave-requests.component.html',
    styleUrls: ['./leave-requests.component.scss']
})
export class LeaveRequestsComponent implements OnInit {

    leaveRequests: LeaveRequestDTO[]//de creat un obiect tip FormGroup
    leaveRequestForm: FormGroup;
    selectedLeaveRequest: LeaveRequestDTO;

    constructor(private leaveRequestService: LeaveRequestService, private formBuilder: FormBuilder) {
        this.leaveRequestForm = this.formBuilder.group({
            exampleControl: ['']
        });
    }

    ngOnInit(): void {
        this.leaveRequests=this.leaveRequestService.getLeaveRequest();
        this.leaveRequestService.loadLeaveRequests().subscribe((leaveRequests) => {
            console.log(leaveRequests)
            this.leaveRequests = leaveRequests
        })
    }
    setSelectedLeaveRequest(request:LeaveRequestDTO){
        this.selectedLeaveRequest=request;
        console.log(request)
    }
}

