import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { TeamsService } from 'src/app/core/services/teams.services';
import { ToastService } from 'src/app/core/services/toast.service';
import { AddedEmployeeDTO, EmployeeDTO, UpdatedEmployeeDTO } from 'src/app/shared/models/employees';
import { SelectOption } from 'src/app/shared/models/select-option';
import { TeamDTO } from 'src/app/shared/models/team-dto';
import { fromStringToNgbDate } from 'src/app/utils/date-methods';

@Component({
  selector: 'employees-detail',
  templateUrl: './employees-detail.component.html',
  styleUrls: ['./employees-detail.component.scss'],
})
export class EmployeesManagementDetailComponent implements OnInit {
  @Input() employee: EmployeeDTO;
  @Output() reloadList = new EventEmitter<boolean>(false);
  @Output() componentClosed = new EventEmitter<boolean>(false);
  addedEmployee: AddedEmployeeDTO;
  form: FormGroup;
  teams: SelectOption[];
  roles: SelectOption[] = [
    { value: 'USER', label: 'User' },
    { value: 'HR', label: 'HR' },
    { value: 'TEAM_LEAD', label: 'Team Lead' },
  ];
  mode: "add" | "view" | "edit" = 'add';
  constructor(
    private formBuilder: FormBuilder,
    private teamsService: TeamsService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    if(this.employee) {
      this.mode = "view";
    }
    this.form = this.formBuilder.group({
      id: new FormControl(''),
      lastname: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', Validators.required),
      teamId: new FormControl('', Validators.required),
      contractStartDate: new FormControl('', Validators.required),
      noDaysOff: new FormControl('', Validators.required),
    });

    this.teamsService
      .getTeams()
      .pipe(
        map((result: TeamDTO[]) => {
          return result.map(team => {
            return {
              value: team.id,
              label: team.name,
            };
          });
        })
      )
      .subscribe(teams => {
        this.teams = teams;
        this.initializeForm();
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['employee'] && this.form && this.employee) {
      this.mode = "view";
      this.initializeForm();
    }
  }
  private initializeForm() {
    this.form.setValue({
      id: this.employee? this.employee.id:"",
      lastname: this.employee? this.employee.lastName:"",
      firstname: this.employee? this.employee.firstName: "",
      username: this.employee? this.employee.username:"",
      email: this.employee? this.employee.email:"",
      role: this.employee? this.employee.role:"",
      teamId: this.employee? this.employee.teamDetails.id:"",
      contractStartDate: this.employee? fromStringToNgbDate(this.employee?.contractStartDate):"",
      noDaysOff: this.employee? this.employee.totalVacationDays:"",
    });
    if(this.mode === "view") {
      this.form.disable();
    }
  }

  addEmployee() {
    const testEmployee = {
      username: this.form.value.username,
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      email: this.form.value.email,
      role: this.form.value.role,
      teamId: this.form.value.teamId,
      contractStartDate: '2022-04-02',
      noDaysOff: this.form.value.noDaysOff,
    };
    // const employee = this.form.value as AddedEmployeeDTO
    this.employeeService.addEmployee(testEmployee).subscribe(
      response => {
        // Handle successful response here
        this.toastService.showSuccess('Utilizatorul a fost adăugat cu succes!');
        this.form.reset();
        this.reloadList.emit(true);
      },
      error => {
        // Handle error here
        this.toastService.showError(error.error.message);
        console.log(error);
      }
    );
  }

  deleteEmployee() {
    const title = 'Inactivare angajat';
    const body = `Sunteti sigur ca doriti sa dezactivati angajatul ${this.employee.lastName} ?`;
    const rejectLabel = 'Renunta';
    const confirmLabel = 'Inactivare';

    this.modalService
      .openConfirmationModal(title, body, rejectLabel, confirmLabel)
      .then(result => {
        if (result) {
          this.employeeService
            .inactivateEmployee(this.employee.id)
            .subscribe(() => {
              console.log('Delete requested for', this.employee.id);
              this.form.reset();
              this.reloadList.emit(true);
            this.toastService.showSuccess("Utilizatorul a fost șters!");
            });
        }
      });
  }
    onCancel() {
      this.componentClosed.emit(true);
      console.log("Component closed");
    }

    changeMode() {
      if(this.mode === "edit") {
        this.mode = "view";
        this.form.disable();
      } else if(this.mode === "view"){
        this.mode = "edit";
        this.form.enable();
        this.form.controls["contractStartDate"].disable();
        this.form.controls["noDaysOff"].disable();
      }
    }

    onUpdatedEmployee() {
      const testEmployee: UpdatedEmployeeDTO = {
        username: this.form.value.username,
        firstName: this.form.value.firstname,
        lastName: this.form.value.lastname,
        email: this.form.value.email,
        role: this.form.value.role,
        teamId: this.form.value.teamId,
        v: this.employee.v
      };
      // const employee = this.form.value as AddedEmployeeDTO
      this.employeeService.updateEmployee(this.employee.id, testEmployee).subscribe(
        response => {
          // Handle successful response here
          this.toastService.showSuccess('Schimbările au fost efectuate!');
          this.form.reset();
          this.reloadList.emit(true);
        },
        error => {
          // Handle error here
          this.toastService.showError(error.error.message);
          console.log(error);
        }
      );
    }
    onSubmit() {
      if(this.employee?.id) {
          this.onUpdatedEmployee()
      } else {
        this.addEmployee()
      }
    }
}
