import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { SplashComponent } from './splash/splash.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        SplashComponent,
        LoginComponent
    ],
    providers: [],
})
export class AuthModule { }
