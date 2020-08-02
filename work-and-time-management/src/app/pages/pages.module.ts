import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CardsModule } from '../cards/cards.module';
import { WorksitesComponent } from './worksites/worksites.component';
import { AddHoursComponent } from './add-hours/add-hours.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SplashComponent } from './auth/splash/splash.component';
import { HoursDropdownComponent } from './add-hours/form-elements/hours-dropdown/hours-dropdown.component';
import { HoursSliderComponent } from './add-hours/form-elements/hours-slider/hours-slider.component';
import { HoursDateSelectionComponent } from './add-hours/form-elements/hours-date-selection/hours-date-selection.component';
import { HoursTableComponent } from './add-hours/form-elements/hours-table/hours-table.component';
import { AddedHoursComponent } from './added-hours/added-hours.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CardsModule,
    ],
    exports: [],
    declarations: [
        WorksitesComponent,
        AddHoursComponent,
        AddedHoursComponent,
        LoginComponent,
        RegisterComponent,
        SplashComponent,
        HoursDropdownComponent,
        HoursSliderComponent,
        HoursDateSelectionComponent,
        HoursTableComponent
    ],
    providers: [],
})
export class PagesModule { }
