import { NgModule } from '@angular/core';
import {LoginComponent} from "./components/login.component";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule],
  exports: [LoginComponent]
})
export class LoginModule { }
