import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardsModule } from 'src/app/cards/cards.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddHoursComponent } from './add-hours.component';
import { HoursDateSelectionComponent } from './form-elements/hours-date-selection/hours-date-selection.component';
import { HoursDropdownComponent } from './form-elements/hours-dropdown/hours-dropdown.component';
import { HoursTableComponent } from './form-elements/hours-table/hours-table.component';
import { HoursSlider22Component } from './form-elements/hours-slider/hours-slider.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CardsModule,
        DirectivesModule
    ],
    exports: [],
    declarations: [
        AddHoursComponent,
        HoursDropdownComponent,
        HoursDateSelectionComponent,
        HoursTableComponent,
        HoursSlider22Component,
    ],
    providers: [],
})
export class AddHoursModule { }
