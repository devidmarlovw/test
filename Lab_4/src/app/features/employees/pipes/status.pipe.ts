import { Pipe, PipeTransform } from "@angular/core";
import { EmployeeDTO } from "src/app/shared/models/employees";

@Pipe({name: 'status'})
export class StatusPipe implements PipeTransform{
  transform(employees: EmployeeDTO[], status: string) {
    if(!status.trim()) {
      return employees;
    }
    if(employees) {
      return employees.filter(employee => {
       return employee.status === status;
      })
    }

  }

}
