import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { WorksitesComponent } from './pages/worksites/worksites.component';
import { AddHoursComponent } from './pages/add-hours/add-hours.component';
import { SplashComponent } from './pages/auth/splash/splash.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AddedHoursComponent } from './pages/added-hours/added-hours.component';
import { ManageWorksitesComponent } from './pages/manage-worksites/manage-worksites.component';
import { ManageWorktypesComponent } from './pages/manage-worktypes/manage-worktypes.component';
import { AdminSettingsComponent } from './pages/admin-settings/admin-settings.component';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { WorksiteUsersComponent } from './pages/manage-worksites/worksite-users/worksite-users.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'welcome', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, data: { animations: { page: 'rootPage' }} },
  { path: 'worksites', component: WorksitesComponent, data: { animation: { page: 'worksitesPage' }} },
  { path: 'current-worksite/:id', component: AddHoursComponent, data: { animation: { page: 'currentWorksitedPage' }}  },
  { path: 'add-hours/day/:date', component: AddHoursComponent, data: { animation: { page: 'addHoursPage' }}  },
  { path: 'add-hours/:id', component: AddHoursComponent, data: { animation: { page: 'addHoursPage' }}  },
  { path: 'added-hours', component: AddedHoursComponent, data: { animation: { page: 'addedHoursPage' }}  },
  { path: 'admin-settings', component: AdminSettingsComponent, data: { animation: { page: 'adminSettingsPage' }}  },
  { path: 'admin/manage-users', component: ManageUsersComponent, data: { animation: { page: 'manageUsersPage' }}  },
  { path: 'manage-worksites', component: ManageWorksitesComponent, data: { animation: { page: 'manageWorksitesPage' }}  },
  { path: 'manage-worksites/add', component: ManageWorksitesComponent },
  { path: 'manage-worksites/edit/:id', component: ManageWorksitesComponent },
  { path: 'manage-worktypes', component: ManageWorktypesComponent, data: { animation: { page: 'manageWorkTypesPage' }}  },
  { path: 'manage-worktypes/add', component: ManageWorktypesComponent },
  { path: 'manage-worktypes/edit/:id', component: ManageWorktypesComponent },
  { path: 'worksite-users', component: WorksiteUsersComponent },
  { path: 'user-management/:id', component: UserManagementComponent },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
