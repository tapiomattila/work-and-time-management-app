import { NgModule } from '@angular/core';
import { WorksitesComponent } from './worksites/worksites.component';
import { ManageWorksitesComponent } from './manage-worksites/manage-worksites.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CommonModule } from '@angular/common';
import { CurrentWorksiteComponent } from './current-worksite/current-worksite.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [],
    declarations: [
        CurrentWorksiteComponent,
        WorksitesComponent,
        ManageWorksitesComponent,
        ManageUsersComponent
    ],
    providers: [],
})
export class PagesModule { }
