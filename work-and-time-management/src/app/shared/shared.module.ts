import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackArrowComponent } from './back-arrow/back-arrow.component';
import { DayHoursComponent } from './day-hours/day-hours.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditFormComponent } from './edit-fom/edit-form.component';

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
        EditFormComponent,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        BackArrowComponent,
        DayHoursComponent,
        DatePickerComponent,
        EditFormComponent
    ],
    providers: [],
})
export class SharedModule { }
