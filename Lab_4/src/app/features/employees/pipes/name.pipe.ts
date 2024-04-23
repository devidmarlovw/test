import { Pipe, PipeTransform } from "@angular/core";
import { EmployeeDTO } from "src/app/shared/models/employees";

@Pipe({name: 'name'})
export class NamePipe implements PipeTransform{
  transform(employees: EmployeeDTO[], search: string) {

    if(!search.trim()) {
      return employees;
    }
    if(employees) {
      return employees.filter(employee => {
        return employee.firstName.toLowerCase().startsWith(search.toLowerCase()) ||
        employee.lastName.toLowerCase().startsWith(search.toLowerCase())
      })
    }

  }

}
