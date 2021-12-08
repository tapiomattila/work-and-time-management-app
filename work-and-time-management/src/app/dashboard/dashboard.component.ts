import { Component, OnInit } from '@angular/core';
import { NavigationHandlerService } from '../services/navigation-handler.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Worksite, WorksitesQuery } from '../stores/worksites/state';
import { RouterRoutesEnum } from '../enumerations/global.enums';
import { WindowService } from '../services/window.service';
import {
    fadeInEnterTrigger,
    fadeInEnterWithDelayTrigger,
    fadeInOutTrigger,
} from '../animations/animations';
import { AuthQuery, AuthService } from '../auth/state';
import { User } from '../stores/users';
import { map } from 'rxjs/operators';

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
    infos;
    profileIconUrl = '';

    constructor(
        private router: Router,
        private authQuery: AuthQuery,
        private worksiteQuery: WorksitesQuery,
        private authService: AuthService,
        public windowService: WindowService,
        public navigationHandlerService: NavigationHandlerService
    ) {}

    ngOnInit() {
        this.momentDay = moment();
        this.user$ = this.authQuery.selectSignedInUser();
        this.currentWorksite$ = this.worksiteQuery.selectLastUpdatedWorksite();
        const authSub = this.authQuery.auth$
            .pipe(map(auth => auth.profilePictureUrl))
            .subscribe(res => {
                this.profileIconUrl = res;
            });
        this.authService.subscriptions.push(authSub);
    }

    toWorksites() {
        this.router.navigate([RouterRoutesEnum.WORKSITES]);
    }

    navigate(route: string, id?: string) {
        this.navigationHandlerService.navigateToRoute(route, id);
    }

    openMenu() {
        this.openMenuModal = true;
    }

    closedModal($event) {
        this.openMenuModal = false;
    }
}
