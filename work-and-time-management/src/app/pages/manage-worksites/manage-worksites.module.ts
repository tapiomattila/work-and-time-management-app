import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageWorksitesComponent } from './manage-worksites/manage-worksites.component';
import { UsersElementComponent } from './users-element/users-element.component';
import { WorksiteUsersComponent } from './worksite-users/worksite-users.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        ManageWorksitesComponent,
        WorksiteUsersComponent,
        UsersElementComponent
    ],
    providers: [],
})
export class ManageWorksitesModule { }
