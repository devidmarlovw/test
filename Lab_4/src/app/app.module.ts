import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import {LoginModule} from "./features/login/login.module";
import {FormsModule} from "@angular/forms";
import {AuthInterceptor} from "./features/login/interceptors/auth.interceptor";

@NgModule({
    declarations: [AppComponent],
    imports: [
        CoreModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgbModule,
        SharedModule,
        LoginModule,
        FormsModule
    ],
    providers: [
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    ],
    bootstrap: [AppComponent],
    exports: []
})
export class AppModule {}
