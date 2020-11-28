import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardsModule } from 'src/app/cards/cards.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddHoursComponent } from './add-hours.component';
import { HoursDateSelectionComponent } from './form-elements/hours-date-selection/hours-date-selection.component';
import { HoursDropdownComponent } from './form-elements/hours-dropdown/hours-dropdown.component';
import { HoursDropdown2Component } from './form-elements/hours-dropdown2/hours-dropdown2.component';
import { HoursSliderComponent } from './form-elements/hours-slider/hours-slider.component';
import { HoursTableComponent } from './form-elements/hours-table/hours-table.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CardsModule,
    ],
    exports: [],
    declarations: [
        AddHoursComponent,
        HoursDropdownComponent,
        HoursDropdown2Component,
        HoursSliderComponent,
        HoursDateSelectionComponent,
        HoursTableComponent,
    ],
    providers: [],
})
export class AddHoursModule { }
