import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EmployeeDTO } from "src/app/shared/models/employees";

@Component ({
  selector: 'employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']

})

export class EmployeesManagementListComponent {
  @Input() employees: EmployeeDTO[];
  @Output() selectedEmployeeChanged = new EventEmitter<EmployeeDTO>();
  @Output() addEmployee = new EventEmitter();

  onSelectedEmployee(employee: EmployeeDTO) {
      this.selectedEmployeeChanged.emit(employee);

  }
  onAddEmployee() {
    this.addEmployee.emit();
  }
}
