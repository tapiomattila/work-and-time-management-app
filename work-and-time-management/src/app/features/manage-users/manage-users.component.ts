import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthQuery } from 'src/app/core/auth';
import { Router } from '@angular/router';
import { Role, RouterRoutesEnum } from 'src/app/core/enums/global.enums';
import { User, UserQuery } from 'src/app/stores/users';
import { HoursQuery, HoursService } from 'src/app/stores/hours';

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.component.html',
    styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent implements OnInit {
    users$: Observable<{
        monthHours$: Observable<any>,
        totalHours$: Observable<number>,
        user: User
    }[]>;

    constructor(
        private authQuery: AuthQuery,
        private router: Router,
        private userQuery: UserQuery,
        private hourQuery: HoursQuery,
        private hourService: HoursService
    ) { }

    ngOnInit() {
        const fetchAllHours$ = this.authQuery.selectSignedInUser()
            .pipe(
                switchMap((user: User) => {
                    return this.handleAdminAllHours(user);
                }),
            );

        this.users$ = fetchAllHours$.pipe(
            switchMap(() => this.userQuery.users$),
            map(el => {
                return el.map(elx => {
                    return {
                        monthHours$: this.hourQuery.selectHoursForCurrentMonth(elx.userId),
                        totalHours$: this.hourQuery.selectTotalHoursByUser(elx.userId),
                        user: elx
                    };
                });
            }),
        );
    }

    handleAdminAllHours(user: User) {
        if (user?.roles.includes(Role.ADMIN)) {
            return this.hourService.setAllHours(this.authQuery.getValue());
        }
        return of(null);
    }

    openUser(user: User) {
        this.router.navigate([RouterRoutesEnum.USER_MANAGEMENT, user.userId]);
    }
}
