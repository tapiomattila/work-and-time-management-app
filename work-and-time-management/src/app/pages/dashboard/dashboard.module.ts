import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
// import { CardsModule } from '../../shared/layout/card/cards.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        // CardsModule
    ],
    exports: [],
    declarations: [DashboardComponent],
    providers: [],
})
export class DashboardModule {}
