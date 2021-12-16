import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { WindowService } from './services/window.service';
import { NavigationHandlerService } from './services/navigation-handler.service';
import { WorksitesService } from './stores/worksites/state';
import { Auth, AuthQuery, AuthService } from './auth/state';
import { WorkTypeService } from './stores/worktypes/state';
import { ManageService } from './pages/manage.service';
import { HoursService } from './stores/hours';
import { User } from './stores/users';
import { RouterEvent } from '@angular/router';
import { GlobalHelperService } from './services/global-helper.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    firebaseSubs: Subscription[] = [];
    storeSubs: Subscription[] = [];
    user$: Observable<User>;
    auth$: Observable<Auth>;
    handleRoles$: Observable<any[]>;

    constructor(
        private worksiteService: WorksitesService,
        private worktypeService: WorkTypeService,
        private hoursService: HoursService,
        private authQuery: AuthQuery,
        private globalhelper: GlobalHelperService,
        public manageService: ManageService,
        public authService: AuthService,
        public navigationHandlerService: NavigationHandlerService,
        public windowService: WindowService
    ) { }

    ngOnInit() {
        this.authService.loader = true;
        this.authenticatedUserStoreUpdate();
        this.user$ = this.authQuery.selectSignedInUser();
        this.auth$ = this.authQuery.auth$;
        this.fetchData();
        this.backButtonUrlMonitor();
    }

    fetchData() {
        const accessWorksitesSub = this.worksiteService
            .fetchUserWorksitesByClient(this.user$)
            .subscribe();

        const worktypeSub = this.worktypeService
            .fetchWorktypesByUser(this.user$)
            .subscribe();

        const hoursSub = this.hoursService
            .fetchUserHours(this.user$)
            .subscribe();

        this.storeSubs.push(accessWorksitesSub);
        this.storeSubs.push(worktypeSub);
        this.storeSubs.push(hoursSub);
    }

    backButtonUrlMonitor() {
        const backButtonSub = this.globalhelper
            .monitorUrl()
            .subscribe((route: RouterEvent) => {
                const currentRoute = route.url.substring(1, route.url.length);
                this.globalhelper.setBackButtonOnUrl(currentRoute);
            });
        this.storeSubs.push(backButtonSub);
    }

    authenticatedUserStoreUpdate() {
        const authSubs = this.authService.firebaseAuthUpdate().subscribe();
        this.firebaseSubs.push(authSubs);
    }

    closeModal() {
        this.manageService.setGeneralModal(false);
    }

    navigate(route: string, id?: string) {
        this.navigationHandlerService.navigateToRoute(route, id);
    }

    ngOnDestroy() {
        this.firebaseSubs.forEach(el => el.unsubscribe());
        this.storeSubs.forEach(el => el.unsubscribe());
    }
}
