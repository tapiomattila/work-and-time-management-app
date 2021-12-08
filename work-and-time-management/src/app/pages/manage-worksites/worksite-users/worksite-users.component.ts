import { Component, OnInit } from '@angular/core';
import { combineQueries } from '@datorama/akita';
import { Observable, of, Subscription } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AuthQuery } from 'src/app/auth/state';
import { ManageService } from '../../manage.service';
import {
    Worksite,
    WorksitesQuery,
    WorksitesService,
} from '../../../stores/worksites/state';
import { User, UserQuery } from 'src/app/stores/users';
import * as moment from 'moment';

interface Data {
    worksites: Worksite[];
    users: User[];
}

@Component({
    selector: 'app-worksite-users',
    templateUrl: './worksite-users.component.html',
    styleUrls: ['./worksite-users.component.scss'],
})
export class WorksiteUsersComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    user$: Observable<User>;
    activeWorksite$: Observable<Worksite>;
    worksites$: Observable<Worksite[]>;
    showModal$: Observable<boolean>;

    data$: Observable<Data>;
    loading$: Observable<boolean>;

    momentDay: moment.Moment;

    constructor(
        private worksitesQuery: WorksitesQuery,
        private worksitesService: WorksitesService,
        private userQuery: UserQuery,
        public manageService: ManageService,
        private authQuery: AuthQuery
    ) {}

    ngOnInit() {
        this.momentDay = moment();
        this.worksites$ = this.worksitesQuery.selectAllLiveWorksites();
        this.data$ = this.constructData();

        this.loading$ = this.data$.pipe(
            startWith(false),
            map(el => {
                const element = el as Data;
                if (element) {
                    return !(
                        element.worksites.length > 0 && element.users.length > 0
                    );
                }
            })
        );
    }

    constructData(): Observable<Data> {
        const worksites$ = this.worksitesQuery.selectAllLiveWorksites();
        const users$ = this.userQuery.selectAll();
        return combineQueries([worksites$, users$]).pipe(
            map(([worksites, users]) => {
                const data: Data = {
                    worksites,
                    users,
                };
                return data;
            })
        );
    }

    worksiteChange(event: {
        userId: string;
        worksiteId: string;
        checked: boolean;
    }) {
        const worksites = this.worksitesQuery.getLiveWorksites();
        const worksite = worksites.find(el => el.id === event.worksiteId);
        const findUser = worksite.users.find(el => el === event.userId);

        if (event.checked && !findUser) {
            const copy = worksite.users.slice(0);
            copy.push(event.userId);
            this.worksitesService.updateStoreWorksiteUsers(
                worksite,
                copy,
                'add',
                this.authQuery.getValue().id
            );
        }

        if (!event.checked) {
            const index = worksite.users.findIndex(el => el === event.userId);
            if (findUser && index !== -1) {
                const copy = worksite.users.slice(0);
                copy.splice(index, 1);
                this.worksitesService.updateStoreWorksiteUsers(
                    worksite,
                    copy,
                    'remove',
                    this.authQuery.getValue().id
                );
            }
        }

        const putWorksiteSubs = this.worksitesQuery
            .selectLiveWorksiteById(event.worksiteId)
            .pipe(
                switchMap(worksiteX => {
                    if (!worksiteX) {
                        return of(null);
                    }
                    return this.worksitesService.putWorksite(
                        event.worksiteId,
                        worksiteX
                    );
                })
            )
            .subscribe();
        this.subscriptions.push(putWorksiteSubs);
    }
}
