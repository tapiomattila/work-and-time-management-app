import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageUsersComponent } from './manage-users.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        ManageUsersComponent
    ],
    providers: [],
})
export class ManageUsersModule { }
