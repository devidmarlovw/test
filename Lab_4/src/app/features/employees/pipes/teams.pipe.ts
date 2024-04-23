import { Pipe, PipeTransform } from "@angular/core";
import { EmployeeDTO } from "src/app/shared/models/employees";

@Pipe({name: 'teamId'})
export class TeamsPipe implements PipeTransform{
  transform(employees: EmployeeDTO[], teamId: string) {
    if(!teamId.trim()) {
      return employees;
    }
    if(teamId === '-1') {
      return employees;
    }
    if(employees) {
      return employees.filter(employee => {
       return Number( employee.teamDetails.id) === Number(teamId);
      })
    }

  }

}
