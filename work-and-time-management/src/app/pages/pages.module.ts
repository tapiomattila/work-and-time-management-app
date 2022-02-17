import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { WorksitesComponent } from './worksites/worksites.component';
import { AddedHoursComponent } from './added-hours/added-hours.component';
import { ManageWorktypesComponent } from './manage-worktypes/manage-worktypes.component';
import { AddHoursModule } from './../features/add-hours/add-hours.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { AuthModule } from './auth/auth.module';
import { ManageUsersModule } from '../features/manage-users/manage-users.module';
import { ManageWorksitesModule } from './manage-worksites/manage-worksites.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AddHoursModule,
        AuthModule,
        ManageUsersModule,
        ManageWorksitesModule
    ],
    exports: [],
    declarations: [
        WorksitesComponent,
        AddedHoursComponent,
        ManageWorktypesComponent,
        UserManagementComponent,
    ],
    providers: [],
})
export class PagesModule { }
