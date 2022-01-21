import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: 
    [
    CommonModule,
    SharedModule
    ],
    exports: [CardComponent],
    declarations: [CardComponent],
    providers: [],
})
export class CardsModule {}
