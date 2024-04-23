import { Component, Input, OnInit} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Observable, map } from "rxjs";
import { EmployeeService } from "src/app/core/services/employee.service";
import { TeamsService } from "src/app/core/services/teams.services";
import { EmployeeDTO } from "src/app/shared/models/employees";
import { SelectOption } from "src/app/shared/models/select-option";

@Component ({
  selector: 'employees-management',
  templateUrl: './employees-management.component.html',
  styleUrls: ['./employees-management.component.scss']

})
export class EmployeesManagementComponent implements OnInit {
   employeesObs: Observable<EmployeeDTO[]>;
   filtersGroup: FormGroup;
   teamList: SelectOption[];
   selectedEmployee: EmployeeDTO;
   showDetailComponent: boolean;
  constructor(
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private teamsService: TeamsService) {}
  onSelectedEmployeeChanged() {
    return this.onSelectedEmployeeChanged;
  }
  ngOnInit () {
    this.employeesObs = this.employeeService.getEmployees();
    this.filtersGroup = this.formBuilder.group({ teamId: '', status: 'ACTIVE', search: ''})
    this.teamsService.getTeams().pipe(map( teams => {
      return teams.map( team => {
        return {value: team.id,
                label: team.name}
      })
    })).subscribe(teams => {
      this.teamList = teams
      this.teamList.unshift({value: '-1', label: 'Toate'})
      this.filtersGroup.controls['teamId'].setValue(this.teamList[0].value);
    })

      ;
  }

  setSelectedEmployee(employee: EmployeeDTO) {
      this.showDetailComponent = true;
      this.selectedEmployee = employee;
      console.log(employee);
    }

    onReloadList(reload: boolean) {
      if(reload) {
        this.employeesObs = this.employeeService.getEmployees();

      }
    }

  onAddEmployee() {
    this.selectedEmployee = null;
    this.showDetailComponent = true;
  }

  onClosedComponent(value: boolean) {
    if (value === true) {
      this.selectedEmployee = null;
      this.showDetailComponent = false;
    }
    console.log("Component closed");

  }
}
