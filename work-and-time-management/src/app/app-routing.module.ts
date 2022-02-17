import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { WorksitesComponent } from './pages/worksites/worksites.component';
import { AddHoursComponent } from './features/add-hours/add-hours/add-hours.component';
import { SplashComponent } from './pages/auth/splash/splash.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AddedHoursComponent } from './pages/added-hours/added-hours.component';
import { ManageWorksitesComponent } from './pages/manage-worksites/manage-worksites/manage-worksites.component';
import { ManageWorktypesComponent } from './pages/manage-worktypes/manage-worktypes.component';
import { ManageUsersComponent } from './features/manage-users/manage-users.component';
import { WorksiteUsersComponent } from './pages/manage-worksites/worksite-users/worksite-users.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'welcome', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { animations: { page: 'rootPage' } },
  },
  {
    path: 'worksites',
    component: WorksitesComponent,
    data: { animation: { page: 'worksitesPage' } },
  },
  {
    path: 'current-worksite/:id',
    component: AddHoursComponent,
    data: { animation: { page: 'currentWorksitedPage' } },
  },
  {
    path: 'add-hours/day/:date',
    component: AddHoursComponent,
    data: { animation: { page: 'addHoursPage' } },
  },
  {
    path: 'add-hours/:id',
    component: AddHoursComponent,
    data: { animation: { page: 'addHoursPage' } },
  },
  {
    path: 'added-hours',
    component: AddedHoursComponent,
    data: { animation: { page: 'addedHoursPage' } },
  },
  {
    path: 'admin/manage-users',
    component: ManageUsersComponent,
    data: { animation: { page: 'manageUsersPage' } },
  },
  {
    path: 'manage-worksites',
    component: ManageWorksitesComponent,
    data: { animation: { page: 'manageWorksitesPage' } },
  },
  { path: 'manage-worksites/add', component: ManageWorksitesComponent },
  { path: 'manage-worksites/edit/:id', component: ManageWorksitesComponent },
  {
    path: 'manage-worktypes',
    component: ManageWorktypesComponent,
    data: { animation: { page: 'manageWorkTypesPage' } },
  },
  { path: 'manage-worktypes/add', component: ManageWorktypesComponent },
  { path: 'manage-worktypes/edit/:id', component: ManageWorktypesComponent },
  { path: 'worksite-users', component: WorksiteUsersComponent },
  { path: 'user-management/:id', component: UserManagementComponent },
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
