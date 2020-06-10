import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackArrowComponent } from './back-arrow/back-arrow.component';
import { DayHoursComponent } from './day-hours/day-hours.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        BackArrowComponent,
        DayHoursComponent,
    ],
    declarations: [
        BackArrowComponent,
        DayHoursComponent
    ],
    providers: [],
})
export class SharedModule { }
