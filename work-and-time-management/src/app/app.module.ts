import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';

@NgModule({
    declarations: [AppComponent, PagenotfoundComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        DashboardModule,
        SharedModule,
        PagesModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),
        AngularFireAuthModule,

        [environment.production ? [] : AkitaNgDevtools.forRoot()],
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
