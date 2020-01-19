import { NgModule } from '@angular/core';
import { DayHoursComponent } from './day-hours.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        DayHoursComponent
    ],
    declarations: [
        DayHoursComponent
    ],
    providers: [],
})
export class SharedModule { }
