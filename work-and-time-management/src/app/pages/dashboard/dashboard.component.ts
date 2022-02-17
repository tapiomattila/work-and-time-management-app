import { Component, OnInit } from '@angular/core';
import { NavigationHandlerService } from '../../core/services/navigation-handler.service';
import { Observable, Subscription, timer } from 'rxjs';
import * as moment from 'moment';
import { Worksite, WorksitesQuery } from '../../stores/worksites/state';
import {
    fadeInEnterTrigger,
    fadeInEnterWithDelayTrigger,
    fadeInOutTrigger,
} from '../../core/animations/animations';
import { AuthQuery } from '../../core/auth';
import { User } from '../../stores/users';
import { switchMap, tap } from 'rxjs/operators';

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
    noWorksitesFound = false;

    data$: Observable<[boolean, Worksite]>;
    currentWorksite$: Observable<Worksite>;

    user$: Observable<User>;
    momentDay: moment.Moment;
    timerSubs: Subscription;

    constructor(
        private authQuery: AuthQuery,
        private worksiteQuery: WorksitesQuery,
        public navigationHandlerService: NavigationHandlerService
    ) { }

    ngOnInit() {
        this.momentDay = moment();
        this.user$ = this.authQuery.selectSignedInUser();
        this.currentWorksite$ = this.worksiteQuery.selectLastUpdatedWorksite();

        const timer$ = timer(3000);
        this.timerSubs = timer$
            .pipe(
                switchMap(() => this.worksiteQuery.selectLastUpdatedWorksite()),
                tap(worksite => {
                    return !worksite
                        ? this.noWorksitesFound = true
                        : false;
                })
            ).subscribe();
    }

    navigate(route: string, id?: string) {
        this.navigationHandlerService.navigateToRoute(route, id);
        this.timerSubs.unsubscribe();
    }
}
