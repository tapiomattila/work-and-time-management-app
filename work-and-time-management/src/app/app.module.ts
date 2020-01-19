import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { CardTemplateComponent } from './templates/card-template/card-template.component';
import { DayHoursComponent } from './shared/day-hours/day-hours.component';
import { environment } from 'src/environments/environment';
import { WorksitesCardComponent } from './cards/worksites-card/worksites-card.component';
import { CurrentWorksiteCardComponent } from './cards/current-worksite-card/current-worksite-card.component';
import { AddWorksiteCardComponent } from './cards/add-worksite-card/add-worksite-card.component';
import { ManageWorksitesCardComponent } from './cards/manage-worksites-card/manage-worksites-card.component';
import { ManageUsersCardComponent } from './cards/manage-users-card/manage-users-card.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PagenotfoundComponent,
    CardTemplateComponent,
    DayHoursComponent,
    WorksitesCardComponent,
    CurrentWorksiteCardComponent,
    AddWorksiteCardComponent,
    ManageWorksitesCardComponent,
    ManageUsersCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    [environment.production ? [] : AkitaNgDevtools.forRoot()]
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
