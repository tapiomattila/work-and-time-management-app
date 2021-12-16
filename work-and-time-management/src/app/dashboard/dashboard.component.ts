import { Component, OnInit } from '@angular/core';
import { NavigationHandlerService } from '../services/navigation-handler.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Worksite, WorksitesQuery } from '../stores/worksites/state';
import { WindowService } from '../services/window.service';
import {
    fadeInEnterTrigger,
    fadeInEnterWithDelayTrigger,
    fadeInOutTrigger,
} from '../animations/animations';
import { AuthQuery } from '../auth/state';
import { User } from '../stores/users';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [
        fadeInEnterTrigger,
        fadeInEnterWithDelayTrigger,
        fadeInOutTrigger,
    ],
})
export class DashboardComponent implements OnInit {
    openMenuModal = false;
    currentWorksite$: Observable<Worksite>;

    user$: Observable<User>;
    momentDay: moment.Moment;

    constructor(
        private authQuery: AuthQuery,
        private worksiteQuery: WorksitesQuery,
        public windowService: WindowService,
        public navigationHandlerService: NavigationHandlerService
    ) {}

    ngOnInit() {
        this.momentDay = moment();
        this.user$ = this.authQuery.selectSignedInUser();
        this.currentWorksite$ = this.worksiteQuery.selectLastUpdatedWorksite();
    }

    navigate(route: string, id?: string) {
        this.navigationHandlerService.navigateToRoute(route, id);
    }
}
