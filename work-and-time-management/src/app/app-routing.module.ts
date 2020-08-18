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

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'worksites', component: WorksitesComponent },
  { path: 'current-worksite/:id', component: AddHoursComponent },
  { path: 'add-hours/:id', component: AddHoursComponent },
  { path: 'added-hours', component: AddedHoursComponent },
  { path: 'manage-worksites', component: ManageWorksitesComponent },
  { path: 'manage-worksites/edit/:id', component: ManageWorksitesComponent },
  { path: 'manage-worksites/add', component: ManageWorksitesComponent },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
