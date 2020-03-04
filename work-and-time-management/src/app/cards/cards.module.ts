import { NgModule } from '@angular/core';
import { WorksitesCardComponent } from './worksites-card/worksites-card.component';
import { CurrentWorksiteCardComponent } from './current-worksite-card/current-worksite-card.component';
import { AddWorksiteCardComponent } from './add-worksite-card/add-worksite-card.component';
import { ManageWorksitesCardComponent } from './manage-worksites-card/manage-worksites-card.component';
import { ManageUsersCardComponent } from './manage-users-card/manage-users-card.component';
import { CommonModule } from '@angular/common';
import { SettingsCardComponent } from './settings-card/settings-card.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        WorksitesCardComponent,
        CurrentWorksiteCardComponent,
        AddWorksiteCardComponent,
        ManageWorksitesCardComponent,
        ManageUsersCardComponent,
        SettingsCardComponent
    ],
    declarations: [
        WorksitesCardComponent,
        CurrentWorksiteCardComponent,
        AddWorksiteCardComponent,
        ManageWorksitesCardComponent,
        ManageUsersCardComponent,
        SettingsCardComponent
    ],
    providers: [],
})
export class CardsModule { }
