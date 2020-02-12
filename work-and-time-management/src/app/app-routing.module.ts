import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { WorksitesComponent } from './pages/worksites/worksites.component';
import { ManageWorksitesComponent } from './pages/manage-worksites/manage-worksites.component';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { CurrentWorksiteComponent } from './pages/current-worksite/current-worksite.component';
import { SettingsCardComponent } from './cards/settings-card/settings-card.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/current-worksite', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'current-worksite', component: CurrentWorksiteComponent },
  { path: 'worksites', component: WorksitesComponent },
  { path: 'manage-worksites', component: ManageWorksitesComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
