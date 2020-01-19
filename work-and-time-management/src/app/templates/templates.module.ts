import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTemplateComponent } from './card-template/card-template.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        CardTemplateComponent
    ],
    declarations: [
        CardTemplateComponent
    ],
    providers: [],
})
export class TemplatesModule { }
