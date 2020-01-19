import { NgModule } from '@angular/core';
import { WorksitesComponent } from './worksites/worksites.component';
import { ManageWorksitesComponent } from './manage-worksites/manage-worksites.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [],
    declarations: [
        WorksitesComponent,
        ManageWorksitesComponent,
        ManageUsersComponent
    ],
    providers: [],
})
export class PagesModule { }
