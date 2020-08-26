import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackArrowComponent } from './back-arrow/back-arrow.component';
import { DayHoursComponent } from './day-hours/day-hours.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditFormComponent } from './edit-fom/edit-form.component';
import { HeaderComponent } from './layout/header/header.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,

        BackArrowComponent,
        DayHoursComponent,
        DatePickerComponent,
        EditFormComponent,
        HeaderComponent,
        LoaderComponent
    ],
    declarations: [
        BackArrowComponent,
        DayHoursComponent,
        DatePickerComponent,
        EditFormComponent,
        HeaderComponent,
        LoaderComponent
    ],
    providers: [],
})
export class SharedModule { }
