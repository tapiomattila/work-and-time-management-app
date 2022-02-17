import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddHoursComponent } from './add-hours/add-hours.component';
import { HoursDateSelectionComponent } from './add-hours-date-selection/hours-date-selection.component';
import { HoursDropdownComponent } from './add-hours-dropdown/hours-dropdown.component';
import { HoursTableComponent } from './add-hours-table/hours-table.component';
import { HoursSliderComponent } from './add-hours-slider/hours-slider.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DirectivesModule,
    ],
    exports: [],
    declarations: [
        AddHoursComponent,
        HoursDropdownComponent,
        HoursDateSelectionComponent,
        HoursTableComponent,
        HoursSliderComponent,
    ],
    providers: [],
})
export class AddHoursModule {}
