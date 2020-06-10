import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CardsModule } from '../cards/cards.module';
import { WorksitesComponent } from './worksites/worksites.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CardsModule
    ],
    exports: [],
    declarations: [
        WorksitesComponent
    ],
    providers: [],
})
export class PagesModule { }
