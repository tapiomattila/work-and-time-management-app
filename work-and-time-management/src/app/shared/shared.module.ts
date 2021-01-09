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
import { MenuModalComponent } from './menu-modal/menu-modal.component';
import { GeneralModalComponent } from './general-modal/general-modal.component';
import { DirectivesModule } from './directives/directives.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule
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
        LoaderComponent,
        MenuModalComponent,
        GeneralModalComponent,
    ],
    declarations: [
        BackArrowComponent,
        DayHoursComponent,
        DatePickerComponent,
        EditFormComponent,
        HeaderComponent,
        LoaderComponent,
        MenuModalComponent,
        GeneralModalComponent,
    ],
    providers: [],
})
export class SharedModule { }
