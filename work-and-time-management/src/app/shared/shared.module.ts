import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackArrowComponent } from './back-arrow/back-arrow.component';
import { DayHoursComponent } from './day-hours/day-hours.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        BackArrowComponent,
        DayHoursComponent,
        DatePickerComponent,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        BackArrowComponent,
        DayHoursComponent,
        DatePickerComponent
    ],
    providers: [],
})
export class SharedModule { }
