import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { CardsModule } from '../cards/cards.module';
import { SharedModule } from '../shared/day-hours/shared.module';

@NgModule({
    imports: [
        CommonModule,
        CardsModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        DashboardComponent
    ],
    providers: [],
})
export class DashboardModule { }
