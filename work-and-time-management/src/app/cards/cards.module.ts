import { NgModule } from '@angular/core';
import { WorksitesCardComponent } from './worksites-card/worksites-card.component';
import { CurrentWorksiteCardComponent } from './current-worksite-card/current-worksite-card.component';
import { AddWorksiteCardComponent } from './add-worksite-card/add-worksite-card.component';
import { ManageWorksitesCardComponent } from './manage-worksites-card/manage-worksites-card.component';
import { ManageUsersCardComponent } from './manage-users-card/manage-users-card.component';
import { CommonModule } from '@angular/common';
import { TemplatesModule } from '../templates/templates.module';

@NgModule({
    imports: [
        CommonModule,
        TemplatesModule
    ],
    exports: [
        WorksitesCardComponent,
        CurrentWorksiteCardComponent,
        AddWorksiteCardComponent,
        ManageWorksitesCardComponent,
        ManageUsersCardComponent,
    ],
    declarations: [
        WorksitesCardComponent,
        CurrentWorksiteCardComponent,
        AddWorksiteCardComponent,
        ManageWorksitesCardComponent,
        ManageUsersCardComponent,
    ],
    providers: [],
})
export class CardsModule { }
