import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineQueries } from '@datorama/akita';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Auth, AuthQuery } from 'src/app/core/auth';
import { User, UserQuery, UserService } from 'src/app/stores/users';
import {
    Worksite,
    WorksitesQuery,
    WorksitesService,
} from '../../stores/worksites/state';

interface ComponentData {
    user: Partial<User>;
    worksites: Worksite[];
}

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    data$: Observable<ComponentData>;
    userWorksites: string[] = [];
    userIdFromRoute = '';

    constructor(
        private worksitesQuery: WorksitesQuery,
        private userQuery: UserQuery,
        private userService: UserService,
        private authQuery: AuthQuery,
        private route: ActivatedRoute,
        private worksiteService: WorksitesService
    ) { }

    ngOnInit() {
        this.populateDataObservable();
        this.initializeWorksiteArray();
        this.userIdFromRoute = this.route.snapshot.paramMap.get('id');
    }

    populateDataObservable() {
        const worksites$ = this.worksitesQuery.selectAllLiveWorksites();
        const auth$ = this.authQuery.auth$;

        const user$ = auth$.pipe(
            switchMap((authx: Auth) => {
                return authx ?
                    this.userQuery.selectUserByUserId(authx.id) :
                    this.userService.fetchUserById({
                        clientId: authx.clientId,
                        email: authx.email,
                        id: authx.id
                    });
            }),

        );

        this.data$ = combineQueries([worksites$, user$])
            .pipe(
                map(([worksites, user]) => {
                    return {
                        worksites,
                        user
                    };
                }),
            );
    }

    initializeWorksiteArray() {
        const initSubs = this.data$.pipe(
            tap(res => {
                const worksites = res.worksites as Worksite[];
                const user = res.user as Partial<User>;
                const filtered = worksites.filter(elx => elx.users.includes(user.userId));
                this.userWorksites = filtered.map((el: Worksite) => {
                    return el.id;
                });
            })
        ).subscribe();
        this.subscriptions.push(initSubs);
    }

    getCheckedState(worksite: Worksite) {
        const userId = this.route.snapshot.paramMap.get('id');
        return worksite.users.includes(userId);
    }

    changeCheckedState(input: HTMLInputElement, worksiteId: string) {
        this.manageUserWorksiteIds(input.checked, worksiteId);
    }

    manageUserWorksiteIds(checkedState: boolean, worksiteId: string) {
        const index = this.userWorksites.findIndex(el => el === worksiteId);

        if (checkedState && index === -1) {
            this.userWorksites.push(worksiteId);
        }

        if (!checkedState && index !== -1) {
            this.userWorksites.splice(index, 1);
        }
    }

    submit() {
        const userWorksites = this.userWorksites;
        const allWorksites = this.worksitesQuery.getLiveWorksites();

        allWorksites.forEach(el => {
            const isWorksiteFound = userWorksites.find(elx => elx === el.id);
            const isUserFoundInWorksite = el.users.includes(this.userIdFromRoute);

            // TODO: refactor logic

            // some bug in user management checkboxes

            if (isWorksiteFound && !isUserFoundInWorksite) {
                // found in userWorksites, not in store, add
                const newUsers = [...el.users, this.userIdFromRoute];
                this.worksiteService.updateStoreWorksiteUsers(el, newUsers, 'add', this.authQuery.getValue().id);

                // found in userWorksites, not in db, add
                const worksiteCopy = { ...el };
                worksiteCopy.users = [...newUsers];
                this.worksiteService.putWorksite(el.id, worksiteCopy);
            }

            if (!isWorksiteFound && isUserFoundInWorksite) {
                // found in store, not in userWorksites, remove
                const oldUsersCopy = el.users.slice(0);
                const index = oldUsersCopy.findIndex(elx => elx === this.userIdFromRoute);
                oldUsersCopy.splice(index, 1);
                this.worksiteService.updateStoreWorksiteUsers(el, oldUsersCopy, 'remove', this.authQuery.getValue().id);

                // found in db, not in userWorksites, remove
                const worksiteCopy = { ...el };
                worksiteCopy.users = [...oldUsersCopy];
                this.worksiteService.putWorksite(el.id, worksiteCopy);
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(el => el.unsubscribe());
    }
}
