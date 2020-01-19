import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { CardsModule } from '../cards/cards.module';

@NgModule({
    imports: [
        CommonModule,
        CardsModule,
    ],
    exports: [],
    declarations: [
        DashboardComponent
    ],
    providers: [],
})
export class DashboardModule { }
